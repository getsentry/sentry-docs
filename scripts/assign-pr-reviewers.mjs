import fs from 'node:fs/promises';

import {
  evaluateDocsReview,
  getPriorityAlertReason,
  parsePriority,
  shouldRequestDocsReviewForEvent,
} from './docs-pr-triage.mjs';
import {createGitHubClient, getGitHubRuntime} from './github-api.mjs';
import {buildReviewerPlan} from './pr-reviewer-assignment.mjs';

const {token, repository, pullRequestNumber, apiBase} = getGitHubRuntime();
const eventAction = process.env.EVENT_ACTION || 'workflow_dispatch';
const dryRun = process.argv.includes('--dry-run');
const [repositoryOwner] = repository.split('/');
const {request: github, paginate} = createGitHubClient({token, apiBase});

async function readCodeowners() {
  for (const path of ['.github/CODEOWNERS', 'CODEOWNERS']) {
    try {
      return await fs.readFile(path, 'utf8');
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
  throw new Error('CODEOWNERS file not found in the trusted base checkout');
}

async function getPreviousPriority() {
  if (eventAction !== 'edited' || !process.env.GITHUB_EVENT_PATH) {
    return null;
  }
  const event = JSON.parse(await fs.readFile(process.env.GITHUB_EVENT_PATH, 'utf8'));
  return event.changes?.body?.from === undefined
    ? null
    : parsePriority(event.changes.body.from);
}

async function isOrganizationMember(login) {
  if (!login) {
    return null;
  }
  try {
    await github(`/orgs/${repositoryOwner}/members/${encodeURIComponent(login)}`);
    return true;
  } catch (error) {
    if (error.status === 404) {
      return false;
    }
    throw error;
  }
}

const pullRequestPath = `/repos/${repository}/pulls/${pullRequestNumber}`;
const [pullRequest, files, requestedReviewers, codeowners, previousPriority] =
  await Promise.all([
    github(pullRequestPath),
    paginate(`${pullRequestPath}/files`),
    github(`${pullRequestPath}/requested_reviewers`),
    readCodeowners(),
    getPreviousPriority(),
  ]);
const organizationMember = await isOrganizationMember(pullRequest.user?.login);

const triage = evaluateDocsReview({
  body: pullRequest.body,
  files,
  author: pullRequest.user,
  authorAssociation: pullRequest.author_association,
  isOrganizationMember: organizationMember,
  isDraft: pullRequest.draft,
});
const priorityAlertReason = previousPriority
  ? getPriorityAlertReason(previousPriority, triage.priority)
  : null;
const requestDocsReview = shouldRequestDocsReviewForEvent(
  eventAction,
  triage,
  previousPriority
);
const includeSpecialists = [
  'opened',
  'reopened',
  'synchronize',
  'ready_for_review',
  'workflow_dispatch',
].includes(eventAction);
const plan = buildReviewerPlan({
  codeowners,
  files,
  repositoryOwner,
  requestedUsers: requestedReviewers.users,
  requestedTeams: requestedReviewers.teams,
  excludedUsers: [pullRequest.user?.login],
  includeSpecialists,
  requestDocsReview,
});

console.log(
  JSON.stringify(
    {
      pullRequest: pullRequestNumber,
      eventAction,
      dryRun,
      triage: {
        priority: triage.priority,
        changes: triage.changes,
        author: triage.author,
        reasons: triage.reasons,
        requestDocsReview,
        priorityAlertReason,
      },
      reviewerPlan: plan,
    },
    null,
    2
  )
);

if (dryRun || (plan.users.length === 0 && plan.teams.length === 0)) {
  process.exit(0);
}

await github(`${pullRequestPath}/requested_reviewers`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({reviewers: plan.users, team_reviewers: plan.teams}),
});

console.log(
  `Requested ${plan.users.length} user reviewer(s) and ${plan.teams.length} team reviewer(s)`
);
