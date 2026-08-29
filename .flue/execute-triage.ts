import {randomUUID} from 'node:crypto';

import {init} from '@flue/runtime';
import type {Flue} from '@flue/runtime/node';
import * as v from 'valibot';

import {TriageIssue} from './agents/triage-issue';
import employeeOverrides from './employee-overrides.json';
import {fetchLinearIssue, toLinearContext} from './linear';
import {
  buildShadowResult,
  type GitHubIssueContext,
  GitHubIssueContextSchema,
} from './triage';

export async function enrichWithLinear(
  issue: GitHubIssueContext,
  apiKey = process.env.LINEAR_API_KEY
): Promise<GitHubIssueContext> {
  if (!apiKey) return issue;
  const linear = await fetchLinearIssue(apiKey, issue);
  return v.parse(GitHubIssueContextSchema, {
    ...issue,
    lastQualifyingLinearActivityAt: linear.lastHumanActivityAt,
    linear: toLinearContext(linear),
  });
}

export async function executeTriage(_runtime: Flue, issue: GitHubIssueContext) {
  const agent = init(TriageIssue, {
    id: `shadow-${issue.number}-${randomUUID()}`,
  });
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
  const decision = reply.data.triageDecision?.at(-1);
  if (!decision) throw new Error('The triage agent did not submit a decision.');
  return buildShadowResult(
    issue,
    decision,
    employeeOverrides,
    new Date().toISOString(),
    reply.metadata
  );
}
