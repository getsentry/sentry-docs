import {randomUUID} from 'node:crypto';

import {init} from '@flue/runtime';
import {type Flue, start} from '@flue/runtime/node';
import * as v from 'valibot';
import {afterAll, beforeAll, describe, expect, test} from 'vitest';

import {TriageIssue} from './agents/triage-issue';
import fixtures from './fixtures/historical-issues.json';
import {GitHubIssueContextSchema, TriageDecisionSchema} from './triage';

const runLiveEvals = process.env.RUN_FLUE_TRIAGE_EVALS === '1';
const describeLive = runLiveEvals ? describe : describe.skip;

describeLive('historical sentry-docs issue triage', () => {
  let runtime: Flue;

  beforeAll(async () => {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is required for live triage evals.');
    }
    runtime = await start({agents: [TriageIssue]});
  });

  afterAll(async () => {
    await runtime?.stop();
  });

  test.each(fixtures)(
    '$issue.number $name',
    async fixture => {
      const issue = v.parse(GitHubIssueContextSchema, fixture.issue);
      const agent = init(TriageIssue, {id: `eval-${issue.number}-${randomUUID()}`});
      const receipt = await agent.dispatch({
        message: {
          kind: 'signal',
          type: 'github.issue.triage',
          tagName: 'github-issue',
          attributes: {
            repository: issue.repository,
            issueNumber: String(issue.number),
          },
          body: JSON.stringify(issue),
        },
      });
      const reply = await agent.read(receipt);
      const decision = v.parse(TriageDecisionSchema, reply.data.triageDecision?.at(-1));

      expect(decision.classification).toBe(fixture.expected.classification);
      if ('automationFlow' in fixture.expected) {
        expect(decision.automationFlow).toBe(fixture.expected.automationFlow);
      }
    },
    180_000
  );
});
