export const PRIORITY_REMINDER_MARKER = '<!-- docs-pr-priority-reminder -->';

export const PRIORITY_REMINDER_BODY = `${PRIORITY_REMINDER_MARKER}

Please update the **IS YOUR CHANGE URGENT?** section of the PR description:

- Select exactly one option.
- If you selected an urgent or other deadline, provide the date as \`YYYY-MM-DD\`.

This information helps the Docs team prioritize your review.`;

function labelName(label) {
  return typeof label === 'string' ? label : label?.name;
}

export function isPriorityReminderComment(comment) {
  return (
    comment.user?.login === 'github-actions[bot]' &&
    comment.body?.split(/\r?\n/, 1)[0].trim() === PRIORITY_REMINDER_MARKER
  );
}

export function buildPriorityMetadataPlan({priority, currentLabels, isDraft, comments}) {
  const labels = (currentLabels ?? []).map(labelName).filter(Boolean);
  const priorityLabels = labels.filter(label => label.startsWith('Priority:'));
  const botReminders = (comments ?? []).filter(isPriorityReminderComment);
  const retainedReminder = botReminders[0];
  const deleteCommentIds = botReminders.slice(1).map(comment => comment.id);
  const needsReminder = !isDraft && !priority.valid;

  const comment = {
    create: false,
    update: null,
    deleteIds: deleteCommentIds,
  };
  if (needsReminder) {
    if (!retainedReminder) {
      comment.create = true;
    } else if (retainedReminder.body !== PRIORITY_REMINDER_BODY) {
      comment.update = {id: retainedReminder.id, body: PRIORITY_REMINDER_BODY};
    }
  } else {
    comment.deleteIds = botReminders.map(existing => existing.id);
  }

  return {
    labels: {
      add: labels.includes(priority.label) ? [] : [priority.label],
      remove: priorityLabels.filter(label => label !== priority.label),
    },
    comment,
  };
}
