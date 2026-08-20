import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';

import * as v from 'valibot';

import employeeOverrides from './employee-overrides.json';
import {
  addIssueLabels,
  createIssueCommentOnce,
  fetchIssueContext,
  removeIssueLabel,
} from './github';
import {
  createLinearCommentOnce,
  fetchLinearIssue,
  fetchLinearTeams,
  priorityNumber,
  resolveLinearTeam,
  updateLinearIssue,
} from './linear';
import {
  type GitHubIssueContext,
  GitHubIssueContextSchema,
  projectPolicy,
  type ShadowTriageResult,
  type TriageDecision,
  TriageDecisionSchema,
} from './triage';
import triageConfig from './triage-config.json';

export const TRIAGE_STATE_PREFIX = '<!-- sentry-docs-triage-state:v2:';

export interface PersistedTriageState {
  policyVersion: 2;
  triagedAt: string;
  decision: TriageDecision;
  applied?: {
    priority: 0 | 1 | 2 | 3 | 4;
    linearTeamId: string;
    githubTeamLabel: string;
  };
  overrides?: {
    priority?: 0 | 1 | 2 | 3 | 4;
    linearTeamId?: string;
  };
}

function encodeState(state: PersistedTriageState): string {
  return `${TRIAGE_STATE_PREFIX}${Buffer.from(JSON.stringify(state)).toString('base64url')} -->`;
}

export function parseTriageState(body: string): PersistedTriageState | undefined {
  const match = body.match(/<!-- sentry-docs-triage-state:v2:([A-Za-z0-9_-]+) -->/);
  if (!match) return undefined;
  const parsed = JSON.parse(Buffer.from(match[1], 'base64url').toString('utf8')) as {
    policyVersion?: number;
    triagedAt?: string;
    decision?: unknown;
    applied?: PersistedTriageState['applied'];
    overrides?: PersistedTriageState['overrides'];
  };
  if (parsed.policyVersion !== 2 || !parsed.triagedAt) return undefined;
  return {
    policyVersion: 2,
    triagedAt: parsed.triagedAt,
    decision: v.parse(TriageDecisionSchema, parsed.decision),
    ...(parsed.applied ? {applied: parsed.applied} : {}),
    ...(parsed.overrides ? {overrides: parsed.overrides} : {}),
  };
}

function needsInformationBody(decision: TriageDecision): string {
  return [
    "We don't have enough information to take action on this issue. Please provide more detail:",
    '',
    ...decision.missingInformation.map(item => `- ${item}`),
    '',
    'A response from the original requester will return the issue to triage.',
  ].join('\n');
}

function triageSummary(
  decision: TriageDecision,
  policy: ReturnType<typeof projectPolicy>
): string {
  return [
    '**Automated triage**',
    '',
    decision.summary,
    '',
    `- Priority: **${policy.effectivePriority}**`,
    `- Team: **${policy.targetLinearTeam}**`,
    `- Actionability: **${decision.actionability}**`,
    `- Recommended action: **${decision.recommendedAction}**`,
    `- Confidence: **${decision.confidence.toFixed(2)}**`,
  ].join('\n');
}

async function readResult(path: string): Promise<ShadowTriageResult> {
  const value = JSON.parse(await readFile(path, 'utf8')) as ShadowTriageResult;
  return {
    ...value,
    issue: v.parse(GitHubIssueContextSchema, value.issue),
    decision: v.parse(TriageDecisionSchema, value.decision),
  };
}

export async function applyTriageResult(
  result: ShadowTriageResult,
  env: NodeJS.ProcessEnv = process.env
): Promise<void> {
  if (env.FLUE_TRIAGE_MODE !== 'apply') {
    console.log('Shadow mode: no triage mutations were applied.');
    return;
  }
  const githubToken = env.GH_TOKEN;
  const linearKey = env.LINEAR_API_KEY;
  if (!githubToken || !linearKey) {
    throw new Error('Apply mode requires GH_TOKEN and LINEAR_API_KEY.');
  }

  let issue: GitHubIssueContext = await fetchIssueContext(
    result.issue.number,
    githubToken
  );
  let linear = await fetchLinearIssue(linearKey, issue);
  issue = v.parse(GitHubIssueContextSchema, {
    ...issue,
    lastQualifyingLinearActivityAt: linear.lastHumanActivityAt,
    linear: {
      id: linear.id,
      identifier: linear.identifier,
      teamId: linear.team.id,
      teamKey: linear.team.key,
      teamName: linear.team.name,
      stateId: linear.state.id,
      stateName: linear.state.name,
      stateType: linear.state.type,
      priority: linear.priority,
      assigneeId: linear.assignee?.id,
      lastHumanActivityAt: linear.lastHumanActivityAt,
    },
  });
  const policy = projectPolicy(issue, result.decision, employeeOverrides);
  const teams = await fetchLinearTeams(linearKey);
  const targetTeam = resolveLinearTeam(teams, policy.targetLinearTeam, triageConfig);
  const existingState = linear.comments
    .toReversed()
    .map(comment => parseTriageState(comment.body))
    .find(Boolean);
  const desiredPriority = priorityNumber(policy.effectivePriority);
  const priorityOverride =
    existingState?.applied &&
    linear.priority !== existingState.applied.priority &&
    linear.priority !== desiredPriority
      ? (linear.priority as 0 | 1 | 2 | 3 | 4)
      : existingState?.overrides?.priority === linear.priority &&
          linear.priority !== desiredPriority
        ? existingState.overrides.priority
        : undefined;
  const teamOverride =
    existingState?.applied &&
    linear.team.id !== existingState.applied.linearTeamId &&
    linear.team.id !== targetTeam.id
      ? linear.team.id
      : existingState?.overrides?.linearTeamId === linear.team.id &&
          linear.team.id !== targetTeam.id
        ? existingState.overrides.linearTeamId
        : undefined;
  const humanPriorityOverride = priorityOverride !== undefined;
  const humanTeamOverride = teamOverride !== undefined;
  const appliedPriority = priorityOverride ?? desiredPriority;
  const appliedTeamId = teamOverride ?? targetTeam.id;

  await updateLinearIssue(linearKey, linear.id, {
    teamId: appliedTeamId,
    priority: appliedPriority,
  });

  const labels = humanTeamOverride ? [] : [policy.githubTeamLabel];
  if (result.decision.platform) labels.push(result.decision.platform);
  if (result.decision.productArea) labels.push(result.decision.productArea);
  if (!humanTeamOverride) {
    for (const existing of issue.labels) {
      if (existing.startsWith('Team:') && existing !== policy.githubTeamLabel) {
        await removeIssueLabel(issue.number, existing, githubToken);
      }
    }
  }
  await addIssueLabels(issue.number, labels, githubToken);

  const sameDecision =
    existingState &&
    JSON.stringify(existingState.decision) === JSON.stringify(result.decision);
  const state: PersistedTriageState = {
    policyVersion: 2,
    triagedAt: sameDecision ? existingState.triagedAt : new Date().toISOString(),
    decision: result.decision,
    applied: {
      priority: desiredPriority,
      linearTeamId: targetTeam.id,
      githubTeamLabel: policy.githubTeamLabel,
    },
    ...(humanPriorityOverride || humanTeamOverride
      ? {
          overrides: {
            ...(humanPriorityOverride ? {priority: appliedPriority} : {}),
            ...(humanTeamOverride ? {linearTeamId: appliedTeamId} : {}),
          },
        }
      : {}),
  };
  const stateMarker = encodeState(state);
  await createLinearCommentOnce(
    linearKey,
    linear,
    stateMarker,
    triageSummary(result.decision, {
      ...policy,
      effectivePriority: (
        {0: 'none', 1: 'urgent', 2: 'high', 3: 'medium', 4: 'low'} as const
      )[appliedPriority],
    })
  );

  if (result.decision.actionability === 'needs-information') {
    const questionHash = createHash('sha256')
      .update(JSON.stringify(result.decision.missingInformation))
      .digest('hex')
      .slice(0, 12);
    await addIssueLabels(issue.number, ['Waiting for: Community'], githubToken);
    await createIssueCommentOnce(
      issue.number,
      `<!-- sentry-docs-needs-information:v1:${questionHash} -->`,
      needsInformationBody(result.decision),
      githubToken
    );
    return;
  }

  await removeIssueLabel(issue.number, 'Waiting for: Community', githubToken);
  if (policy.parkingLotReview === 'immediate-priority-none' && appliedPriority === 0) {
    await addIssueLabels(issue.number, ['Parking Lot'], githubToken);
    const docsMention = triageConfig.teamMentions.docs;
    await createLinearCommentOnce(
      linearKey,
      linear,
      '<!-- sentry-docs-parking-review:v1 -->',
      `${docsMention} review requested: this issue is proposed for Parking Lot (${result.decision.parkingLotReason}). GitHub remains open and Linear remains active until a person approves or reprioritizes it.`
    );
  }
}

async function main(): Promise<void> {
  const index = process.argv.indexOf('--result');
  const path = index === -1 ? undefined : process.argv[index + 1];
  if (!path) throw new Error('Usage: pnpm triage:apply --result <triage.json>');
  await applyTriageResult(await readResult(path));
}

if (process.argv[1]?.endsWith('apply-triage.ts')) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
