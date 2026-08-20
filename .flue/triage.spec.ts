import * as v from 'valibot';
import {describe, expect, test} from 'vitest';

import fixtures from './fixtures/historical-issues.json';
import {
  buildShadowResult,
  type EmployeeOverrides,
  type GitHubIssueContext,
  GitHubIssueContextSchema,
  identifyEmployee,
  inferTemplate,
  parseIssueForm,
  parseLinearLinkback,
  projectPolicy,
  type TriageDecision,
} from './triage';

const overrides: EmployeeOverrides = {
  employees: ['employee-override'],
  nonEmployees: ['external-override'],
};

const issue: GitHubIssueContext = {
  repository: 'getsentry/sentry-docs',
  number: 123,
  title: 'Broken docs link',
  body: '### URL\n\nhttps://docs.sentry.io/old\n\n### Additional Info\n\n_No response_',
  labels: ['Docs Platform', 'Bug', '404'],
  template: 'broken-link',
  formFields: {URL: 'https://docs.sentry.io/old'},
  author: {login: 'sentry-user', association: 'MEMBER', type: 'User'},
  state: 'open',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
  lastQualifyingGitHubActivityAt: '2026-01-02T00:00:00.000Z',
  url: 'https://github.com/getsentry/sentry-docs/issues/123',
  comments: [],
  linkedPullRequests: [],
  linearLinkback: {
    identifier: 'DOCS-123',
    url: 'https://linear.app/getsentry/issue/DOCS-123',
  },
};

const decision: TriageDecision = {
  classification: 'broken-link',
  actionability: 'actionable',
  team: 'Team: Docs',
  contentOwner: 'docs',
  targetLinearTeam: 'docs',
  routingConfidence: 0.95,
  routingEvidence: ['The issue concerns a docs-owned broken link.'],
  priority: 'low',
  effort: 'small',
  linearLabel: 'Docs Platform',
  confidence: 0.95,
  summary: 'A repository-owned link has a verified replacement.',
  evidence: ['The URL appears in docs/example.mdx.'],
  relatedFiles: ['docs/example.mdx'],
  missingInformation: [],
  automationFlow: 'broken-link-fix',
  recommendedAction: 'candidate-quick-fix',
  quickFix: {
    kind: 'content-edit',
    description: 'Replace the old URL.',
    brokenUrl: 'https://docs.sentry.io/old',
    replacementUrl: '/new/',
    targetFiles: ['docs/example.mdx'],
  },
};

describe('issue normalization', () => {
  test('parses populated issue-form fields and removes empty responses', () => {
    expect(parseIssueForm(issue.body)).toEqual({URL: 'https://docs.sentry.io/old'});
  });

  test('infers templates with the most specific broken-link rule first', () => {
    expect(inferTemplate(['Docs Platform', 'Bug', '404'])).toBe('broken-link');
    expect(inferTemplate(['Docs', 'SDKs'])).toBe('sdk-docs');
    expect(inferTemplate([])).toBe('unknown');
  });

  test('extracts only exact DOCS linkbacks from the Linear bot', () => {
    expect(
      parseLinearLinkback([
        {
          author: 'linear-code',
          body: '<a href="https://linear.app/getsentry/issue/DOCS-2661/title">DOCS-2661</a>',
        },
      ])
    ).toEqual({
      identifier: 'DOCS-2661',
      url: 'https://linear.app/getsentry/issue/DOCS-2661/title',
    });
    expect(
      parseLinearLinkback([
        {author: 'someone-else', body: 'https://linear.app/getsentry/issue/DOCS-2661'},
      ])
    ).toBeUndefined();
  });

  test('rejects contradictory model decisions', () => {
    expect(() =>
      buildShadowResult(
        issue,
        {...decision, linearLabel: 'Docs Content'},
        overrides,
        '2026-01-03T00:00:00.000Z'
      )
    ).toThrow();
  });

  test.each(fixtures)('validates historical fixture $issue.number', fixture => {
    expect(() => v.parse(GitHubIssueContextSchema, fixture.issue)).not.toThrow();
  });
});

describe('employee identification', () => {
  test('uses OWNER and MEMBER associations', () => {
    expect(identifyEmployee('person', 'MEMBER', overrides)).toEqual({
      isEmployee: true,
      employeeSource: 'association',
    });
  });

  test('allows explicit overrides in both directions', () => {
    expect(identifyEmployee('employee-override', 'NONE', overrides).isEmployee).toBe(
      true
    );
    expect(identifyEmployee('external-override', 'MEMBER', overrides)).toEqual({
      isEmployee: false,
      employeeSource: 'non-employee-override',
    });
  });

  test('fails safe for issues created through Linear sync', () => {
    expect(identifyEmployee('linear-code', 'NONE', overrides)).toEqual({
      isEmployee: true,
      employeeSource: 'linear-sync',
    });
  });
});

describe('policy projection', () => {
  test('checks successful resolution automation before employee protections', () => {
    const policy = projectPolicy(issue, decision, overrides);

    expect(policy.resolutionAutomationCandidate).toBe(true);
    expect(policy.employeeProtectionsDeferred).toBe(false);
    expect(policy.effectivePriority).toBe('high');
    expect(policy.individualOwnerRequired).toBe(true);
    expect(policy.employeeFallbackPriority).toBe('high');
    expect(policy.employeeFallbackOwnerDueAt).toBe('2026-01-08T00:00:00.000Z');
    expect(policy.closurePolicy).toBe('after-validated-resolution');
    expect(policy.parkingLotEligibleAt).toBeUndefined();
  });

  test('sets a high priority floor and seven-day owner deadline for employees', () => {
    const ordinaryDecision: TriageDecision = {
      ...decision,
      automationFlow: 'none',
      recommendedAction: 'route',
      quickFix: undefined,
    };
    const policy = projectPolicy(issue, ordinaryDecision, overrides);

    expect(policy.effectivePriority).toBe('high');
    expect(policy.individualOwnerRequired).toBe(true);
    expect(policy.individualOwnerDueAt).toBe('2026-01-08T00:00:00.000Z');
    expect(policy.highPriorityReviewDueAt).toBe('2026-01-29T00:00:00.000Z');
    expect(policy.closurePolicy).toBe('human-only');
  });

  test('gives external needs-information issues no priority and a 14-day close date', () => {
    const externalIssue: GitHubIssueContext = {
      ...issue,
      author: {login: 'external-user', association: 'NONE', type: 'User'},
      lastQualifyingLinearActivityAt: '2026-01-01T00:00:00.000Z',
    };
    const needsInformation: TriageDecision = {
      ...decision,
      actionability: 'needs-information',
      priority: 'none',
      automationFlow: 'needs-information',
      recommendedAction: 'request-information',
      confidence: 0.85,
      missingInformation: ['Where is the broken link displayed?'],
      quickFix: undefined,
    };
    const policy = projectPolicy(externalIssue, needsInformation, overrides);

    expect(policy.needsInformationCloseDueAt).toBe('2026-01-15T00:00:00.000Z');
    expect(policy.effectivePriority).toBe('none');
    expect(policy.parkingLotEligibleAt).toBeUndefined();
    expect(policy.parkingLotGitHubLabel).toBe('Parking Lot');
    expect(policy.parkingLotLinearStatus).toBe('Canceled');
    expect(policy.parkingLotLinearStatusType).toBe('canceled');
    expect(policy.closurePolicy).toBe('after-needs-information-timeout');
  });

  test('preserves a human High priority on external needs-information work', () => {
    const externalIssue: GitHubIssueContext = {
      ...issue,
      author: {login: 'external-user', association: 'NONE', type: 'User'},
      linear: {
        id: 'linear-id',
        identifier: 'DOCS-123',
        teamId: 'docs-id',
        teamKey: 'DOCS',
        teamName: 'Docs',
        stateId: 'state-id',
        stateName: 'Triage',
        stateType: 'triage',
        priority: 2,
      },
    };
    const needsInformation: TriageDecision = {
      ...decision,
      actionability: 'needs-information',
      priority: 'none',
      automationFlow: 'needs-information',
      recommendedAction: 'request-information',
      missingInformation: ['Which page is affected?'],
      quickFix: undefined,
    };
    const policy = projectPolicy(externalIssue, needsInformation, overrides);

    expect(policy.effectivePriority).toBe('high');
    expect(policy.needsInformationCloseDueAt).toBeUndefined();
  });

  test('clamps three calendar months at the end of a shorter month', () => {
    const externalIssue: GitHubIssueContext = {
      ...issue,
      author: {login: 'external-user', association: 'NONE', type: 'User'},
      lastQualifyingGitHubActivityAt: '2025-08-31T00:00:00.000Z',
      lastQualifyingLinearActivityAt: '2025-08-30T00:00:00.000Z',
    };
    const ordinaryDecision: TriageDecision = {
      ...decision,
      automationFlow: 'none',
      recommendedAction: 'route',
      quickFix: undefined,
    };

    expect(
      projectPolicy(externalIssue, ordinaryDecision, overrides).parkingLotEligibleAt
    ).toBe('2025-11-30T00:00:00.000Z');
  });

  test('sends external no-priority work to immediate Parking Lot review', () => {
    const externalIssue: GitHubIssueContext = {
      ...issue,
      author: {login: 'external-user', association: 'NONE', type: 'User'},
    };
    const noPriority: TriageDecision = {
      ...decision,
      priority: 'none',
      automationFlow: 'none',
      recommendedAction: 'route',
      quickFix: undefined,
      parkingLotReason: 'low-impact',
    };
    const policy = projectPolicy(externalIssue, noPriority, overrides);

    expect(policy.parkingLotReview).toBe('immediate-priority-none');
    expect(policy.closurePolicy).toBe('parking-lot-review');
  });

  test('routes a specific SDK issue deterministically to its Linear team', () => {
    const sdkIssue: GitHubIssueContext = {
      ...issue,
      formFields: {SDK: 'Python SDK'},
    };
    const sdkDecision: TriageDecision = {
      ...decision,
      team: 'Team: Web Backend SDKs',
      contentOwner: 'sdk-team',
      targetLinearTeam: 'web-backend-sdks',
    };
    const policy = projectPolicy(sdkIssue, sdkDecision, overrides);

    expect(policy.targetLinearTeam).toBe('web-backend-sdks');
    expect(policy.githubTeamLabel).toBe('Team: Web Backend SDKs');
    expect(policy.routingSource).toBe('issue-form');
  });

  test('builds a versioned result with explicit shadow warnings', () => {
    const result = buildShadowResult(
      issue,
      decision,
      overrides,
      '2026-01-03T00:00:00.000Z'
    );

    expect(result.schemaVersion).toBe(2);
    expect(result.mode).toBe('shadow');
    expect(result.warnings).toContain(
      'Shadow mode: no GitHub or Linear mutations were attempted.'
    );
  });
});
