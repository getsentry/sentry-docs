import {randomUUID} from 'node:crypto';
import {appendFile, mkdir, writeFile} from 'node:fs/promises';
import {dirname} from 'node:path';

import {init} from '@flue/runtime';
import {start} from '@flue/runtime/node';

import {TriageIssue} from './agents/triage-issue';
import employeeOverrides from './employee-overrides.json';
import {fetchIssueContext} from './github';
import {buildShadowResult} from './triage';

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

async function writeJobSummary(
  result: ReturnType<typeof buildShadowResult>
): Promise<void> {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;

  const linear = result.issue.linearLinkback?.identifier ?? 'Not available yet';
  const content = [
    `## Shadow triage for #${result.issue.number}`,
    '',
    '| Field | Value |',
    '| --- | --- |',
    `| Classification | \`${result.decision.classification}\` |`,
    `| Team | \`${result.decision.team}\` |`,
    `| Model priority | \`${result.decision.priority}\` |`,
    `| Policy priority | \`${result.policy.effectivePriority}\` |`,
    `| Employee | \`${result.policy.isEmployee}\` |`,
    `| Linear | \`${linear}\` |`,
    `| Action | \`${result.decision.recommendedAction}\` |`,
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
  const issue = await fetchIssueContext(issueNumber);
  const runtime = await start({agents: [TriageIssue]});

  try {
    const agent = init(TriageIssue, {
      id: `shadow-${issueNumber}-${randomUUID()}`,
    });
    const receipt = await agent.dispatch({
      message: {
        kind: 'signal',
        type: 'github.issue.triage',
        tagName: 'github-issue',
        attributes: {
          repository: issue.repository,
          issueNumber: String(issue.number),
        },
        body: JSON.stringify(issue),
      },
    });
    const reply = await agent.read(receipt);
    const decision = reply.data.triageDecision?.at(-1);
    if (!decision) throw new Error('The triage agent did not submit a decision.');

    const result = buildShadowResult(
      issue,
      decision,
      employeeOverrides,
      new Date().toISOString(),
      reply.metadata
    );
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
