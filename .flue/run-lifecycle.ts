import {parseTriageState, type PersistedTriageState} from './apply-triage';
import employeeOverrides from './employee-overrides.json';
import {
  addIssueLabels,
  createIssueCommentOnce,
  fetchIssueContext,
  hasIssueCommentBySince,
  listIssueNumbers,
  removeIssueLabel,
  updateIssueState,
} from './github';
import {
  createLinearCommentOnce,
  fetchLinearIssue,
  fetchLinearTeams,
  resolveLinearTeam,
  stateByType,
  updateLinearIssue,
} from './linear';
import {priorityFromLinear, projectPolicy} from './triage';
import triageConfig from './triage-config.json';

function isDue(value: string | undefined, now: Date): boolean {
  return Boolean(value && new Date(value).getTime() <= now.getTime());
}

function reminderBody(target: string, docs: string, message: string): string {
  return target === docs ? `${docs} ${message}` : `${target} ${docs} ${message}`;
}

export async function processIssue(
  issueNumber: number,
  githubToken: string,
  linearKey: string,
  now: Date
): Promise<void> {
  const issue = await fetchIssueContext(issueNumber, githubToken);
  const linear = await fetchLinearIssue(linearKey, issue);
  if (['completed', 'duplicate'].includes(linear.state.type)) return;
  const state = linear.comments
    .map(comment =>
      parseTriageState(comment.body, linearKey, {
        githubIssueNumber: issue.number,
        linearIssueId: linear.id,
      })
    )
    .filter((value): value is PersistedTriageState => Boolean(value))
    .sort((first, second) => second.revision - first.revision)[0];
  if (!state) return;

  const enriched = {
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
  };
  const currentPriority = priorityFromLinear(linear.priority);
  const lifecycleDecision =
    state.decision.actionability === 'actionable' && currentPriority
      ? {...state.decision, priority: currentPriority}
      : state.decision;
  const policy = projectPolicy(
    {...enriched, createdAt: state.triagedAt},
    lifecycleDecision,
    employeeOverrides
  );
  const targetMention = triageConfig.teamMentions[policy.targetLinearTeam];
  const docsMention = triageConfig.teamMentions.docs;

  if (
    linear.state.type !== 'canceled' &&
    policy.individualOwnerRequired &&
    isDue(policy.individualOwnerDueAt, now)
  ) {
    await createLinearCommentOnce(
      linearKey,
      linear,
      '<!-- sentry-docs-owner-reminder:v1 -->',
      reminderBody(
        targetMention,
        docsMention,
        'this High/Urgent issue still needs an individual owner.'
      )
    );
  }

  if (linear.state.type !== 'canceled' && isDue(policy.highPriorityReviewDueAt, now)) {
    await createLinearCommentOnce(
      linearKey,
      linear,
      '<!-- sentry-docs-four-week-reminder:v1 -->',
      reminderBody(
        targetMention,
        docsMention,
        'this High/Urgent issue remains unresolved four weeks after triage.'
      )
    );
  }

  if (state.decision.actionability === 'needs-information') {
    const requesterResponded = await hasIssueCommentBySince(
      issue.number,
      issue.author.login,
      state.triagedAt,
      githubToken
    );
    if (requesterResponded) {
      await removeIssueLabel(issue.number, 'Waiting for: Community', githubToken);
      await createLinearCommentOnce(
        linearKey,
        linear,
        '<!-- sentry-docs-requester-responded:v1 -->',
        `${docsMention} the requester supplied more information; the issue has returned to triage.`
      );
      return;
    }
    if (!policy.isEmployee && isDue(policy.needsInformationCloseDueAt, now)) {
      const teams = await fetchLinearTeams(linearKey);
      const currentTeam =
        teams.find(team => team.id === linear.team.id) ??
        resolveLinearTeam(teams, policy.targetLinearTeam, triageConfig);
      if (
        linear.state.type !== 'canceled' ||
        linear.state.name.toLowerCase() !== 'canceled'
      ) {
        await updateLinearIssue(linearKey, linear.id, {
          stateId: stateByType(currentTeam, 'canceled').id,
        });
      }
      await createIssueCommentOnce(
        issue.number,
        '<!-- sentry-docs-needs-information-timeout:v1 -->',
        'Closing because we did not receive enough information to take action within 14 days. A maintainer can reopen this if more detail becomes available.',
        githubToken
      );
      await updateIssueState(issue.number, 'closed', 'not_planned', githubToken);
    }
    return;
  }

  if (
    policy.parkingLotReview === 'inactive-three-months' &&
    isDue(policy.parkingLotEligibleAt, now)
  ) {
    const teams = await fetchLinearTeams(linearKey);
    const currentTeam =
      teams.find(team => team.id === linear.team.id) ??
      resolveLinearTeam(teams, policy.targetLinearTeam, triageConfig);
    await addIssueLabels(issue.number, ['Parking Lot'], githubToken);
    if (
      linear.state.type !== 'canceled' ||
      linear.state.name.toLowerCase() !== 'canceled'
    ) {
      await updateLinearIssue(linearKey, linear.id, {
        stateId: stateByType(currentTeam, 'canceled').id,
      });
    }
    await createIssueCommentOnce(
      issue.number,
      '<!-- sentry-docs-parking-lot-inactive:v1 -->',
      'Closing as de-prioritized after three months without qualifying GitHub or Linear activity.',
      githubToken
    );
    await updateIssueState(issue.number, 'closed', 'not_planned', githubToken);
  }
}

async function main(): Promise<void> {
  if (process.env.FLUE_TRIAGE_MODE !== 'apply') {
    console.log('Shadow mode: lifecycle mutations are disabled.');
    return;
  }
  const githubToken = process.env.GH_TOKEN;
  const linearKey = process.env.LINEAR_API_KEY;
  if (!githubToken || !linearKey) {
    throw new Error('Lifecycle apply mode requires GH_TOKEN and LINEAR_API_KEY.');
  }
  const numbers = await listIssueNumbers('open', Number.POSITIVE_INFINITY, githubToken);
  const now = new Date();
  const failures: Array<{issue: number; error: string}> = [];
  for (const number of numbers) {
    try {
      await processIssue(number, githubToken, linearKey, now);
    } catch (error) {
      console.error(`Lifecycle failed for #${number}:`, error);
      failures.push({issue: number, error: String(error)});
    }
  }
  if (failures.length) {
    throw new Error(`Lifecycle failed for ${failures.length} issues.`);
  }
}

if (process.argv[1]?.endsWith('run-lifecycle.ts')) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
