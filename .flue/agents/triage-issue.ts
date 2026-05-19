import {Type, type FlueContext, type ToolDef} from '@flue/runtime';
import {local} from '@flue/runtime/node';
import * as v from 'valibot';

export const triggers = {};

const REPO = 'getsentry/sentry-docs';

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignore\s+(all\s+)?above/i,
  /disregard\s+(all\s+)?previous/i,
  /you\s+are\s+now\s+/i,
  /new\s+instructions?\s*:/i,
  /system\s*:\s*/i,
  /\bact\s+as\b/i,
  /reveal\s+(your|the)\s+(system\s+)?prompt/i,
  /what\s+are\s+your\s+instructions/i,
  /echo\s+\$\w+/i,
  /curl\s+.*\|\s*sh/i,
  /base64\s+-d/i,
  /\beval\b.*\(/i,
];

function detectInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((p) => p.test(text));
}

interface GitHubIssue {
  number: number;
  title: string;
  body: string;
  labels: Array<{name: string}>;
  user: {login: string};
  created_at: string;
  state: string;
}

function githubTools(token: string): ToolDef[] {
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github+json',
  };

  return [
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
        const items = (data.items ?? []).map((i: Record<string, unknown>) => ({
          number: i.number,
          title: i.title,
          state: i.state,
        }));
        return JSON.stringify(items);
      },
    },
    {
      name: 'get_linked_prs',
      description: 'Get PRs that reference a given issue number. Returns cross-referenced PRs.',
      parameters: Type.Object({
        issueNumber: Type.Number({description: 'The issue number'}),
      }),
      execute: async (args) => {
        const res = await fetch(
          `https://api.github.com/repos/${REPO}/issues/${args.issueNumber}/timeline?per_page=100`,
          {headers}
        );
        const events = await res.json();
        if (!Array.isArray(events)) return JSON.stringify([]);
        const prs = events
          .filter((e: Record<string, unknown>) =>
            e.event === 'cross-referenced' && (e as any).source?.issue?.pull_request
          )
          .map((e: any) => ({
            number: e.source.issue.number,
            title: e.source.issue.title,
            state: e.source.issue.state,
            merged: e.source.issue.pull_request?.merged_at != null,
          }));
        return JSON.stringify(prs);
      },
    },
  ];
}

async function fetchIssue(token: string, issueNumber: number): Promise<GitHubIssue> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/issues/${issueNumber}`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
      },
    }
  );
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as GitHubIssue;
}

export default async function ({init, payload, env}: FlueContext) {
  const dryRun = env.DRY_RUN !== 'false';
  const issueNumber = payload.issueNumber as number;
  const token = env.GH_TOKEN ?? '';

  const issue = await fetchIssue(token, issueNumber);

  const titleFlagged = detectInjection(issue.title);
  const bodyFlagged = detectInjection(issue.body ?? '');

  if (titleFlagged || bodyFlagged) {
    return {
      classification: 'support-question' as const,
      issueNumber: issue.number,
      flagged: true,
      flaggedFields: [
        ...(titleFlagged ? ['title'] : []),
        ...(bodyFlagged ? ['body'] : []),
      ],
      summary: `Issue #${issue.number} flagged for potential prompt injection. Skipping AI triage.`,
      suggestedLabels: [],
      relatedDocs: [],
      triageReport: `## Triage: #${issue.number}\n\n**Flagged:** Potential prompt injection detected. Manual review required.`,
    };
  }

  const agent = await init({
    model: 'anthropic/claude-sonnet-4-6',
    sandbox: local(),
    tools: githubTools(token),
  });

  const session = await agent.session();

  const triageSchema = v.object({
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
    priority: v.picklist(['urgent', 'high', 'medium', 'low']),
    effort: v.picklist(['small', 'medium', 'large']),
    summary: v.string(),
    relatedDocs: v.array(v.string()),
    suggestedLabels: v.array(v.string()),
    linearLabel: v.picklist(['Docs Content', 'Docs Platform']),
    triageReport: v.string(),
  });

  const {data} = await session.skill('classify-docs-issue', {
    args: {
      issueNumber: issue.number,
      title: issue.title,
      body: issue.body ?? '',
      labels: issue.labels.map((l) => l.name),
      author: issue.user.login,
      createdAt: issue.created_at,
      dryRun,
    },
    schema: triageSchema,
  });

  if (!dryRun && env.LINEAR_API_KEY) {
    const priorityMap: Record<string, number> = {
      urgent: 1, high: 2, medium: 3, low: 4,
    };

    const linearLabel = data.linearLabel === 'Docs Platform'
      ? '4fabaa78-16de-409c-aef9-ae444f9a1b64'
      : 'cf546561-75df-421d-981e-b51b41151351';

    const searchRes = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers: {
        Authorization: env.LINEAR_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query($filter: IssueFilter) {
          issues(filter: $filter, first: 1) {
            nodes { id identifier }
          }
        }`,
        variables: {
          filter: {
            team: {key: {eq: 'DOCS'}},
            attachments: {url: {contains: `sentry-docs/issues/${issue.number}`}},
          },
        },
      }),
    });
    const searchData = await searchRes.json() as any;
    const existingIssue = searchData?.data?.issues?.nodes?.[0];

    if (existingIssue) {
      await fetch('https://api.linear.app/graphql', {
        method: 'POST',
        headers: {
          Authorization: env.LINEAR_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation($id: String!, $input: IssueUpdateInput!) {
            issueUpdate(id: $id, input: $input) { success }
          }`,
          variables: {
            id: existingIssue.id,
            input: {
              priority: priorityMap[data.priority] ?? 3,
              labelIds: [linearLabel],
            },
          },
        }),
      });
    }
  }

  return data;
}
