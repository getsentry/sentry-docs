import {parsePriority} from './docs-pr-triage.mjs';
import {
  PRIORITY_REMINDER_BODY,
  buildPriorityMetadataPlan,
  isPriorityReminderComment,
} from './pr-priority-metadata.mjs';

const token = process.env.GH_TOKEN;
const repository = process.env.REPOSITORY;
const pullRequestNumber = Number(process.env.PR_NUMBER);
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
    const error = new Error(`GitHub API ${response.status}: ${data?.message ?? text}`);
    error.status = response.status;
    throw error;
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

const pullRequestPath = `/repos/${repository}/pulls/${pullRequestNumber}`;
const issuePath = `/repos/${repository}/issues/${pullRequestNumber}`;
const [pullRequest, comments] = await Promise.all([
  github(pullRequestPath),
  paginate(`${issuePath}/comments`),
]);
const priority = parsePriority(pullRequest.body);
const plan = buildPriorityMetadataPlan({
  priority,
  currentLabels: pullRequest.labels,
  isDraft: pullRequest.draft,
  comments,
});

console.log(
  JSON.stringify(
    {
      pullRequest: pullRequestNumber,
      dryRun,
      priority,
      metadataPlan: plan,
    },
    null,
    2
  )
);

if (dryRun) {
  process.exit(0);
}

const latestPullRequest = await github(pullRequestPath);
if (
  latestPullRequest.body !== pullRequest.body ||
  latestPullRequest.draft !== pullRequest.draft
) {
  console.log('Pull request metadata changed during evaluation; skipping stale update');
  process.exit(0);
}

for (const label of plan.labels.remove) {
  try {
    await github(`${issuePath}/labels/${encodeURIComponent(label)}`, {method: 'DELETE'});
  } catch (error) {
    if (error.status !== 404) {
      throw error;
    }
  }
}
if (plan.labels.add.length > 0) {
  await github(`${issuePath}/labels`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({labels: plan.labels.add}),
  });
}

for (const commentId of plan.comment.deleteIds) {
  try {
    await github(`/repos/${repository}/issues/comments/${commentId}`, {method: 'DELETE'});
  } catch (error) {
    if (error.status !== 404) {
      throw error;
    }
  }
}

async function createReminderIfMissing() {
  const latestComments = await paginate(`${issuePath}/comments`);
  if (!latestComments.some(isPriorityReminderComment)) {
    await github(`${issuePath}/comments`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({body: PRIORITY_REMINDER_BODY}),
    });
  }
}

if (plan.comment.update) {
  try {
    await github(`/repos/${repository}/issues/comments/${plan.comment.update.id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({body: plan.comment.update.body}),
    });
  } catch (error) {
    if (error.status !== 404) {
      throw error;
    }
    await createReminderIfMissing();
  }
} else if (plan.comment.create) {
  await createReminderIfMissing();
}

console.log('Priority metadata synchronized');
