import {createHmac} from 'node:crypto';

import {beforeEach, describe, expect, test, vi} from 'vitest';

import type {GitHubIssueContext, TriageDecision} from './triage';

const mocks = vi.hoisted(() => ({
  addIssueLabels: vi.fn(),
  createIssueCommentOnce: vi.fn(),
  createLinearCommentOnce: vi.fn(),
  fetchIssueContext: vi.fn(),
  fetchLinearIssue: vi.fn(),
  fetchLinearTeams: vi.fn(),
  hasIssueCommentBySince: vi.fn(),
  listIssueNumbers: vi.fn(),
  removeIssueLabel: vi.fn(),
  resolveLinearTeam: vi.fn(),
  stateByType: vi.fn(),
  updateIssueState: vi.fn(),
  updateLinearIssue: vi.fn(),
}));

vi.mock('./github', () => ({
  addIssueLabels: mocks.addIssueLabels,
  createIssueCommentOnce: mocks.createIssueCommentOnce,
  fetchIssueContext: mocks.fetchIssueContext,
  hasIssueCommentBySince: mocks.hasIssueCommentBySince,
  listIssueNumbers: mocks.listIssueNumbers,
  removeIssueLabel: mocks.removeIssueLabel,
  updateIssueState: mocks.updateIssueState,
}));

vi.mock('./linear', () => ({
  createLinearCommentOnce: mocks.createLinearCommentOnce,
  fetchLinearIssue: mocks.fetchLinearIssue,
  fetchLinearTeams: mocks.fetchLinearTeams,
  resolveLinearTeam: mocks.resolveLinearTeam,
  stateByType: mocks.stateByType,
  updateLinearIssue: mocks.updateLinearIssue,
}));

import {processIssue} from './run-lifecycle';

const decision: TriageDecision = {
  classification: 'product-docs',
  actionability: 'actionable',
  team: 'Team: Docs',
  contentOwner: 'docs',
  targetLinearTeam: 'docs',
  routingConfidence: 1,
  routingEvidence: ['Docs-owned product content.'],
  priority: 'medium',
  effort: 'small',
  linearLabel: 'Docs Content',
  confidence: 0.9,
  summary: 'Example',
  evidence: ['Example evidence'],
  relatedFiles: [],
  missingInformation: [],
  automationFlow: 'none',
  recommendedAction: 'route',
};

const issue: GitHubIssueContext = {
  repository: 'getsentry/sentry-docs',
  number: 123,
  title: 'Example',
  body: 'Example',
  labels: [],
  template: 'unknown',
  formFields: {},
  author: {login: 'external', association: 'NONE', type: 'User'},
  state: 'open',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  lastQualifyingGitHubActivityAt: '2026-01-01T00:00:00.000Z',
  url: 'https://github.com/getsentry/sentry-docs/issues/123',
  comments: [],
  linkedPullRequests: [],
  linearLinkback: {
    identifier: 'DOCS-123',
    url: 'https://linear.app/getsentry/issue/DOCS-123',
  },
};

function stateComment(): string {
  const value = {
    policyVersion: 2,
    revision: 1,
    githubIssueNumber: 123,
    linearIssueId: 'linear-id',
    triagedAt: '2026-01-01T00:00:00.000Z',
    decision,
  };
  const payload = Buffer.from(JSON.stringify(value)).toString('base64url');
  const signature = createHmac('sha256', 'linear-key')
    .update(payload)
    .digest('base64url');
  return `<!-- sentry-docs-triage-state:v2:${payload}.${signature} -->`;
}

function linear(stateName = 'Canceled', priority = 3) {
  return {
    id: 'linear-id',
    identifier: 'DOCS-123',
    title: 'Example',
    url: 'https://linear.app/getsentry/issue/DOCS-123',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    priority,
    team: {id: 'docs-id', key: 'DOCS', name: 'Docs'},
    state: {id: 'state-id', name: stateName, type: 'canceled'},
    assignee: null,
    comments: [
      {id: 'comment-id', body: stateComment(), createdAt: '2026-01-01T00:00:00.000Z'},
    ],
    history: [],
    lastHumanActivityAt: '2026-01-01T00:00:00.000Z',
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.fetchIssueContext.mockResolvedValue(issue);
  mocks.fetchLinearTeams.mockResolvedValue([
    {
      id: 'docs-id',
      key: 'DOCS',
      name: 'Docs',
      states: [{id: 'canceled-id', name: 'Canceled', type: 'canceled'}],
    },
  ]);
  mocks.stateByType.mockReturnValue({
    id: 'canceled-id',
    name: 'Canceled',
    type: 'canceled',
  });
  mocks.hasIssueCommentBySince.mockResolvedValue(false);
});

describe('lifecycle reconciliation', () => {
  test('finishes GitHub closure when Linear was already canceled', async () => {
    mocks.fetchLinearIssue.mockResolvedValue(linear());

    await processIssue(
      123,
      'github-token',
      'linear-key',
      ['linear-key'],
      new Date('2026-05-01')
    );

    expect(mocks.updateLinearIssue).not.toHaveBeenCalled();
    expect(mocks.addIssueLabels).toHaveBeenCalledWith(
      123,
      ['Parking Lot'],
      'github-token'
    );
    expect(mocks.updateIssueState).toHaveBeenCalledWith(
      123,
      'closed',
      'not_planned',
      'github-token'
    );
  });

  test('moves a duplicate-type cancellation to the exact Canceled state', async () => {
    mocks.fetchLinearIssue.mockResolvedValue(linear('Duplicate'));

    await processIssue(
      123,
      'github-token',
      'linear-key',
      ['linear-key'],
      new Date('2026-05-01')
    );

    expect(mocks.updateLinearIssue).toHaveBeenCalledWith('linear-key', 'linear-id', {
      stateId: 'canceled-id',
    });
  });

  test('honors a human High-priority override and does not park the issue', async () => {
    mocks.fetchLinearIssue.mockResolvedValue({
      ...linear('Unstarted', 2),
      state: {id: 'unstarted-id', name: 'Unstarted', type: 'unstarted'},
    });

    await processIssue(
      123,
      'github-token',
      'linear-key',
      ['linear-key'],
      new Date('2026-05-01')
    );

    expect(mocks.addIssueLabels).not.toHaveBeenCalledWith(
      123,
      ['Parking Lot'],
      'github-token'
    );
    expect(mocks.updateIssueState).not.toHaveBeenCalled();
    expect(mocks.createLinearCommentOnce).toHaveBeenCalled();
  });
});
