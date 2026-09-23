import {describe, expect, it, vi} from 'vitest';

import {parsePriority} from './docs-pr-triage.mjs';
import {
  PRIORITY_REMINDER_BODY,
  PRIORITY_REMINDER_MARKER,
  buildPriorityMetadataPlan,
  isPriorityReminderComment,
  reconcilePriorityMetadata,
} from './pr-priority-metadata.mjs';

function bodyWith(option) {
  return `## IS YOUR CHANGE URGENT?

${option}

## SLA`;
}

function priority(option) {
  return parsePriority(bodyWith(option));
}

function reminder(id, body = PRIORITY_REMINDER_BODY) {
  return {id, body, user: {login: 'github-actions[bot]'}};
}

describe('buildPriorityMetadataPlan labels', () => {
  it('adds the parsed priority while preserving unrelated labels', () => {
    const plan = buildPriorityMetadataPlan({
      priority: priority('- [x] No deadline: Not urgent'),
      currentLabels: ['Docs', 'Team: SDKs'],
      isDraft: false,
      comments: [],
    });

    expect(plan.labels).toEqual({add: ['Priority: Normal'], remove: []});
  });

  it('removes conflicting priority labels and skips an existing desired label', () => {
    const plan = buildPriorityMetadataPlan({
      priority: priority('- [x] Other deadline: 2026-10-01'),
      currentLabels: [
        {name: 'Priority: Normal'},
        {name: 'Priority: Urgent'},
        {name: 'Priority: Deadline'},
        {name: 'Docs'},
      ],
      isDraft: false,
      comments: [],
    });

    expect(plan.labels).toEqual({
      add: [],
      remove: ['Priority: Normal', 'Priority: Urgent'],
    });
  });
});

describe('buildPriorityMetadataPlan reminder comments', () => {
  const invalid = parsePriority(bodyWith('- [ ] No deadline: Not urgent'));
  const valid = priority('- [x] No deadline: Not urgent');

  it('creates one reminder for an invalid ready PR', () => {
    const plan = buildPriorityMetadataPlan({
      priority: invalid,
      currentLabels: [],
      isDraft: false,
      comments: [],
    });

    expect(plan.comment).toEqual({create: true, update: null, deleteIds: []});
  });

  it('updates an outdated bot reminder and ignores a contributor marker', () => {
    const plan = buildPriorityMetadataPlan({
      priority: invalid,
      currentLabels: [],
      isDraft: false,
      comments: [
        reminder(1, `${PRIORITY_REMINDER_MARKER}\nOld instructions`),
        {id: 2, body: PRIORITY_REMINDER_MARKER, user: {login: 'contributor'}},
      ],
    });

    expect(plan.comment).toEqual({
      create: false,
      update: {id: 1, body: PRIORITY_REMINDER_BODY},
      deleteIds: [],
    });
  });

  it('does not claim a bot comment containing the marker after the first line', () => {
    const unrelated = {
      id: 1,
      body: `Another workflow comment\n${PRIORITY_REMINDER_MARKER}`,
      user: {login: 'github-actions[bot]'},
    };

    expect(isPriorityReminderComment(unrelated)).toBe(false);
    const plan = buildPriorityMetadataPlan({
      priority: invalid,
      currentLabels: [],
      isDraft: false,
      comments: [unrelated],
    });
    expect(plan.comment).toEqual({create: true, update: null, deleteIds: []});
  });

  it('retains one current reminder and deletes duplicate bot reminders', () => {
    const plan = buildPriorityMetadataPlan({
      priority: invalid,
      currentLabels: [],
      isDraft: false,
      comments: [reminder(1), reminder(2), reminder(3)],
    });

    expect(plan.comment).toEqual({create: false, update: null, deleteIds: [2, 3]});
  });

  it('deletes bot reminders after correction', () => {
    const plan = buildPriorityMetadataPlan({
      priority: valid,
      currentLabels: [],
      isDraft: false,
      comments: [reminder(1), reminder(2)],
    });

    expect(plan.comment).toEqual({create: false, update: null, deleteIds: [1, 2]});
  });

  it('does not remind drafts and removes a reminder after conversion to draft', () => {
    const plan = buildPriorityMetadataPlan({
      priority: invalid,
      currentLabels: [],
      isDraft: true,
      comments: [reminder(1)],
    });

    expect(plan.comment).toEqual({create: false, update: null, deleteIds: [1]});
    expect(plan.labels.add).toEqual(['Priority: Needs Triage']);
  });
});

describe('reconcilePriorityMetadata', () => {
  const normalBody = bodyWith('- [x] No deadline: Not urgent');
  const urgentBody = bodyWith('- [x] Urgent deadline: 2026-09-15');

  it('reapplies metadata when the PR changes during a write', async () => {
    let state = {body: normalBody, labels: [], isDraft: false, comments: []};
    const applied = [];
    const apply = plan => {
      applied.push(plan.labels.add[0]);
      state = {
        ...state,
        body: applied.length === 1 ? urgentBody : state.body,
        labels: [plan.labels.add[0]],
      };
      return Promise.resolve();
    };

    await expect(
      reconcilePriorityMetadata({load: () => Promise.resolve(state), apply})
    ).resolves.toMatchObject({attempts: 2, priority: {label: 'Priority: Urgent'}});
    expect(applied).toEqual(['Priority: Normal', 'Priority: Urgent']);
  });

  it('does not mutate during a dry run', async () => {
    const apply = vi.fn();

    await expect(
      reconcilePriorityMetadata({
        load: () =>
          Promise.resolve({
            body: normalBody,
            labels: [],
            isDraft: false,
            comments: [],
          }),
        apply,
        dryRun: true,
      })
    ).resolves.toMatchObject({attempts: 1, dryRun: true});
    expect(apply).not.toHaveBeenCalled();
  });

  it('fails visibly when metadata does not stabilize', async () => {
    let urgent = false;

    await expect(
      reconcilePriorityMetadata({
        load: () =>
          Promise.resolve({
            body: urgent ? urgentBody : normalBody,
            labels: [],
            isDraft: false,
            comments: [],
          }),
        apply: () => {
          urgent = !urgent;
          return Promise.resolve();
        },
        maxAttempts: 2,
      })
    ).rejects.toThrow('did not stabilize after 2 attempts');
  });
});
