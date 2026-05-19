import {Type, type FlueContext, type ToolDef} from '@flue/runtime/client';
import * as v from 'valibot';

export const triggers = {};

const REPO = 'getsentry/sentry-docs';

function githubTools(token: string): ToolDef[] {
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github+json',
  };

  return [
    {
      name: 'fetch_issue',
      description: 'Fetch a GitHub issue by number. Returns the issue JSON.',
      parameters: Type.Object({
        issueNumber: Type.Number({description: 'The issue number'}),
      }),
      execute: async (args) => {
        const res = await fetch(
          `https://api.github.com/repos/${REPO}/issues/${args.issueNumber}`,
          {headers}
        );
        return await res.json();
      },
    },
    {
      name: 'search_issues',
      description: 'Search for related issues. Returns up to 5 results.',
      parameters: Type.Object({
        query: Type.String({description: 'Search terms'}),
      }),
      execute: async (args) => {
        const q = encodeURIComponent(`${args.query} repo:${REPO} type:issue`);
        const res = await fetch(
          `https://api.github.com/search/issues?q=${q}&per_page=5`,
          {headers}
        );
        const data = await res.json();
        return (data.items ?? []).map((i: Record<string, unknown>) => ({
          number: i.number,
          title: i.title,
          state: i.state,
        }));
      },
    },
  ];
}

export default async function ({init, payload, env}: FlueContext) {
  const dryRun = env.DRY_RUN !== 'false';

  const agent = await init({
    model: 'anthropic/claude-sonnet-4-6',
    sandbox: 'local',
    tools: githubTools(env.GH_TOKEN ?? ''),
  });

  const session = await agent.session();

  const {data} = await session.skill('classify-docs-issue', {
    args: {issueNumber: payload.issueNumber, dryRun},
    schema: v.object({
      classification: v.picklist([
        'sdk-docs',
        'product-docs',
        'developer-docs',
        'platform-bug',
        'platform-improvement',
        'broken-link',
        'duplicate',
        'support-question',
      ]),
      platform: v.optional(v.string()),
      productArea: v.optional(v.string()),
      team: v.optional(v.string()),
      impact: v.picklist(['small', 'medium', 'large']),
      effort: v.picklist(['small', 'medium', 'large']),
      summary: v.string(),
      relatedDocs: v.array(v.string()),
      suggestedLabels: v.array(v.string()),
      linearLabel: v.picklist(['Docs Content', 'Docs Platform']),
      triageReport: v.string(),
    }),
  });

  return data;
}
