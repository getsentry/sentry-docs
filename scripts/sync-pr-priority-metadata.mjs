import {parsePriority} from './docs-pr-triage.mjs';
import {createGitHubClient, getGitHubRuntime} from './github-api.mjs';
import {
  PRIORITY_REMINDER_BODY,
  buildPriorityMetadataPlan,
  isPriorityReminderComment,
} from './pr-priority-metadata.mjs';

const {token, repository, pullRequestNumber, apiBase} = getGitHubRuntime();
const dryRun = process.argv.includes('--dry-run');
const {request: github, paginate} = createGitHubClient({token, apiBase});

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
