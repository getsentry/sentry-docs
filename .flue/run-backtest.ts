import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

import {start} from '@flue/runtime/node';

import {TriageIssue} from './agents/triage-issue';
import {enrichWithLinear, executeTriage} from './execute-triage';
import {fetchIssueContext, listIssueNumbers} from './github';
import {fetchLinearTeams, resolveLinearTeam} from './linear';
import type {ShadowTriageResult} from './triage';
import triageConfig from './triage-config.json';

interface BacktestRow {
  github: string;
  linear: string;
  employee: boolean;
  actionability: string;
  autoFix: boolean;
  priority: string;
  currentLinearTeam: string;
  proposedLinearTeam: string;
  parkingLotReason: string;
  proposedAction: string;
  confidence: number;
  evidence: string;
  reviewerDecision: string;
}

function argument(name: string, fallback: string): string {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : (process.argv[index + 1] ?? fallback);
}

export function csv(value: unknown): string {
  const text = String(value ?? '');
  const safe = /^[\t\r ]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

function html(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function proposedAction(result: ShadowTriageResult): string {
  if (result.decision.actionability === 'needs-information') {
    return 'Request information';
  }
  if (result.decision.automationFlow === 'broken-link-fix') {
    return 'Attempt broken-link PR';
  }
  if (result.decision.automationFlow === 'duplicate') return 'Review duplicate closure';
  if (result.decision.automationFlow === 'already-resolved') {
    return 'Close as resolved';
  }
  if (result.policy.parkingLotReview === 'immediate-priority-none') {
    return 'Parking Lot review';
  }
  return `Route at ${result.policy.effectivePriority}`;
}

function row(result: ShadowTriageResult): BacktestRow {
  return {
    github: `#${result.issue.number}`,
    linear: result.issue.linear?.identifier ?? 'unmapped',
    employee: result.policy.isEmployee,
    actionability: result.decision.actionability,
    autoFix: result.policy.resolutionAutomationCandidate,
    priority: result.policy.effectivePriority,
    currentLinearTeam: result.issue.linear?.teamName ?? 'unknown',
    proposedLinearTeam: result.policy.targetLinearTeam,
    parkingLotReason: result.decision.parkingLotReason ?? '',
    proposedAction: proposedAction(result),
    confidence: result.decision.confidence,
    evidence: result.decision.evidence.join(' | '),
    reviewerDecision: '',
  };
}

async function writeReports(
  directory: string,
  results: ShadowTriageResult[],
  errors: Array<{issue: number; error: string}>
): Promise<void> {
  await mkdir(directory, {recursive: true});
  const rows = results.map(row);
  const columns = Object.keys(rows[0] ?? {github: ''}) as Array<keyof BacktestRow>;
  const csvBody = [
    columns.map(csv).join(','),
    ...rows.map(value => columns.map(column => csv(value[column])).join(',')),
  ].join('\n');
  const htmlBody = `<!doctype html>
<html><head><meta charset="utf-8"><title>Triage backtest</title>
<style>body{font:14px system-ui;margin:24px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:6px;vertical-align:top}th{position:sticky;top:0;background:#fff}tr:nth-child(even){background:#f7f7f7}</style></head>
<body><h1>Triage backtest</h1><p>${rows.length} decisions, ${errors.length} errors. No mutations were applied.</p>
<table><thead><tr>${columns.map(column => `<th>${html(column)}</th>`).join('')}</tr></thead>
<tbody>${rows.map(value => `<tr>${columns.map(column => `<td>${html(value[column])}</td>`).join('')}</tr>`).join('')}</tbody></table>
<h2>Errors</h2><pre>${html(JSON.stringify(errors, null, 2))}</pre></body></html>`;
  await Promise.all([
    writeFile(
      resolve(directory, 'triage-backtest.json'),
      JSON.stringify({rows, results, errors}, null, 2)
    ),
    writeFile(resolve(directory, 'triage-backtest.csv'), csvBody),
    writeFile(resolve(directory, 'triage-backtest.html'), htmlBody),
  ]);
}

async function main(): Promise<void> {
  const limit = Number(argument('--limit', '50'));
  const state = argument('--state', 'open') as 'open' | 'closed' | 'all';
  const output = argument('--output', '.flue/output/backtest');
  if (process.env.LINEAR_API_KEY) {
    const teams = await fetchLinearTeams(process.env.LINEAR_API_KEY);
    for (const target of Object.keys(triageConfig.linearTeams)) {
      resolveLinearTeam(
        teams,
        target as keyof typeof triageConfig.linearTeams,
        triageConfig
      );
    }
  }
  const numbers = await listIssueNumbers(state, limit);
  const runtime = await start({agents: [TriageIssue]});
  const results: ShadowTriageResult[] = [];
  const errors: Array<{issue: number; error: string}> = [];
  try {
    for (const number of numbers) {
      try {
        const issue = await enrichWithLinear(await fetchIssueContext(number));
        const result = await executeTriage(runtime, issue);
        results.push(result);
        console.log(`#${number}: ${proposedAction(result)}`);
      } catch (error) {
        errors.push({issue: number, error: String(error)});
      }
    }
  } finally {
    await runtime.stop();
  }
  await writeReports(output, results, errors);
}

if (process.argv[1]?.endsWith('run-backtest.ts')) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
