import {createHmac} from 'node:crypto';

import {describe, expect, test} from 'vitest';

import {parseTriageState, TRIAGE_STATE_PREFIX} from './apply-triage';
import type {TriageDecision} from './triage';

const decision: TriageDecision = {
  classification: 'product-docs',
  actionability: 'actionable',
  team: 'Team: Docs',
  contentOwner: 'docs',
  targetLinearTeam: 'docs',
  routingConfidence: 1,
  routingEvidence: ['Product documentation is Docs-owned.'],
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

describe('persisted triage state', () => {
  test('parses a versioned hidden Linear comment marker', () => {
    const state = {
      policyVersion: 2,
      revision: 1,
      githubIssueNumber: 123,
      linearIssueId: 'linear-id',
      triagedAt: '2026-01-01T00:00:00.000Z',
      decision,
    };
    const secret = 'test-secret';
    const payload = Buffer.from(JSON.stringify(state)).toString('base64url');
    const signature = createHmac('sha256', secret).update(payload).digest('base64url');
    const marker = `${TRIAGE_STATE_PREFIX}${payload}.${signature} -->`;

    const expected = {githubIssueNumber: 123, linearIssueId: 'linear-id'};
    expect(parseTriageState(marker, secret, expected)).toEqual(state);
    expect(parseTriageState(marker, 'wrong-secret', expected)).toBeUndefined();
    expect(
      parseTriageState(marker, secret, {
        githubIssueNumber: 999,
        linearIssueId: 'another-linear-id',
      })
    ).toBeUndefined();
  });
});
