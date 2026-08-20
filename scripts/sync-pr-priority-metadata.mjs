import {createGitHubClient, getGitHubRuntime} from './github-api.mjs';
import {
  PRIORITY_REMINDER_BODY,
  isPriorityReminderComment,
  reconcilePriorityMetadata,
} from './pr-priority-metadata.mjs';

const {token, repository, pullRequestNumber, apiBase} = getGitHubRuntime();
const dryRun = process.argv.includes('--dry-run');
const {request: github, paginate} = createGitHubClient({token, apiBase});

const pullRequestPath = `/repos/${repository}/pulls/${pullRequestNumber}`;
const issuePath = `/repos/${repository}/issues/${pullRequestNumber}`;

async function loadMetadataState() {
  const [pullRequest, comments] = await Promise.all([
    github(pullRequestPath),
    paginate(`${issuePath}/comments`),
  ]);
  return {
    body: pullRequest.body,
    labels: pullRequest.labels,
    isDraft: pullRequest.draft,
    comments,
  };
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

async function applyMetadataPlan(plan) {
  for (const label of plan.labels.remove) {
    try {
      await github(`${issuePath}/labels/${encodeURIComponent(label)}`, {
        method: 'DELETE',
      });
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
      await github(`/repos/${repository}/issues/comments/${commentId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }
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
}

const result = await reconcilePriorityMetadata({
  load: loadMetadataState,
  apply: applyMetadataPlan,
  dryRun,
  onPlan: ({attempt, priority, plan}) =>
    console.log(
      JSON.stringify(
        {
          pullRequest: pullRequestNumber,
          dryRun,
          attempt,
          priority,
          metadataPlan: plan,
        },
        null,
        2
      )
    ),
});

if (!dryRun) {
  console.log(`Priority metadata synchronized in ${result.attempts} attempt(s)`);
}
