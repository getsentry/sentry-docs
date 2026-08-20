import {appendFile, mkdir, writeFile} from 'node:fs/promises';
import {dirname} from 'node:path';

import {start} from '@flue/runtime/node';

import {TriageIssue} from './agents/triage-issue';
import {enrichWithLinear, executeTriage} from './execute-triage';
import {fetchIssueContext} from './github';
import type {ShadowTriageResult} from './triage';

function issueNumberFromArgs(args: string[]): number {
  const index = args.indexOf('--issue');
  const value = index === -1 ? undefined : args[index + 1];
  const issueNumber = Number(value);
  if (!Number.isInteger(issueNumber) || issueNumber < 1) {
    throw new Error('Usage: pnpm triage:shadow --issue <positive issue number>');
  }
  return issueNumber;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function writeJobSummary(result: ShadowTriageResult): Promise<void> {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;

  const linear = result.issue.linearLinkback?.identifier ?? 'Not available yet';
  const content = [
    `## Shadow triage for #${result.issue.number}`,
    '',
    '| Field | Value |',
    '| --- | --- |',
    `| Classification | \`${result.decision.classification}\` |`,
    `| Actionability | \`${result.decision.actionability}\` |`,
    `| GitHub team | \`${result.policy.githubTeamLabel}\` |`,
    `| Linear team | \`${result.policy.targetLinearTeam}\` |`,
    `| Model priority | \`${result.decision.priority}\` |`,
    `| Policy priority | \`${result.policy.effectivePriority}\` |`,
    `| Employee | \`${result.policy.isEmployee}\` |`,
    `| Linear | \`${linear}\` |`,
    `| Action | \`${result.decision.recommendedAction}\` |`,
    `| Parking Lot review | \`${result.policy.parkingLotReview}\` |`,
    `| Confidence | \`${result.decision.confidence.toFixed(2)}\` |`,
    '',
    '<details><summary>Summary and evidence</summary>',
    '',
    `<p>${escapeHtml(result.decision.summary)}</p>`,
    '<ul>',
    ...result.decision.evidence.map(item => `<li>${escapeHtml(item)}</li>`),
    '</ul>',
    '</details>',
    '',
    '> Shadow mode did not mutate GitHub or Linear. Download the run artifact for the complete versioned result.',
    '',
  ].join('\n');
  await appendFile(summaryPath, content);
}

async function main(): Promise<void> {
  const issueNumber = issueNumberFromArgs(process.argv.slice(2));
  const issue = await enrichWithLinear(await fetchIssueContext(issueNumber));
  const runtime = await start({agents: [TriageIssue]});

  try {
    const result = await executeTriage(runtime, issue);
    const json = `${JSON.stringify(result, null, 2)}\n`;
    const outputPath = process.env.TRIAGE_OUTPUT;
    if (outputPath) {
      await mkdir(dirname(outputPath), {recursive: true});
      await writeFile(outputPath, json);
    }
    await writeJobSummary(result);
    process.stdout.write(json);
  } finally {
    await runtime.stop();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
