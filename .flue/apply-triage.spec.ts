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
      triagedAt: '2026-01-01T00:00:00.000Z',
      decision,
    };
    const marker = `${TRIAGE_STATE_PREFIX}${Buffer.from(JSON.stringify(state)).toString('base64url')} -->`;

    expect(parseTriageState(marker)).toEqual(state);
  });
});
