import fs from 'node:fs/promises';

import {
  evaluateDocsReview,
  getPriorityAlertReason,
  parsePriority,
  shouldRequestDocsReviewForEvent,
} from './docs-pr-triage.mjs';
import {buildReviewerPlan} from './pr-reviewer-assignment.mjs';

const token = process.env.GH_TOKEN;
const repository = process.env.REPOSITORY;
const pullRequestNumber = Number(process.env.PR_NUMBER);
const eventAction = process.env.EVENT_ACTION || 'workflow_dispatch';
const dryRun = process.argv.includes('--dry-run');

if (!token) {
  throw new Error('GH_TOKEN is required');
}
if (!repository?.includes('/')) {
  throw new Error('REPOSITORY must use the owner/name format');
}
if (!Number.isInteger(pullRequestNumber) || pullRequestNumber <= 0) {
  throw new Error('PR_NUMBER must be a positive integer');
}

const [repositoryOwner] = repository.split('/');
const apiBase = process.env.GITHUB_API_URL || 'https://api.github.com';

async function github(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...options.headers,
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${data?.message ?? text}`);
  }
  return data;
}

async function paginate(path) {
  const items = [];
  for (let page = 1; ; page += 1) {
    const separator = path.includes('?') ? '&' : '?';
    const result = await github(`${path}${separator}per_page=100&page=${page}`);
    items.push(...result);
    if (result.length < 100) {
      return items;
    }
  }
}

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

const pullRequestPath = `/repos/${repository}/pulls/${pullRequestNumber}`;
const [pullRequest, files, requestedReviewers, codeowners, previousPriority] =
  await Promise.all([
    github(pullRequestPath),
    paginate(`${pullRequestPath}/files`),
    github(`${pullRequestPath}/requested_reviewers`),
    readCodeowners(),
    getPreviousPriority(),
  ]);

const triage = evaluateDocsReview({
  body: pullRequest.body,
  files,
  author: pullRequest.user,
  authorAssociation: pullRequest.author_association,
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
        types: triage.types,
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
