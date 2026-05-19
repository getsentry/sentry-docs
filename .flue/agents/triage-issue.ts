import {type FlueContext, type ToolDef, Type} from '@flue/runtime';
import {local} from '@flue/runtime/node';
import * as v from 'valibot';

export const triggers = {};

const REPO = 'getsentry/sentry-docs';
const TRIAGE_MARKER = '<!-- flue-triage -->';

const PRIORITY_MAP: Record<string, number> = {
  urgent: 1,
  high: 2,
  medium: 3,
  low: 4,
};

const LINEAR_LABEL_IDS: Record<string, string> = {
  'Docs Platform': '3c20b421-3f10-46f1-b8c5-0186d18646fc',
  'Docs Content': '3f843dec-1c10-4a4c-a475-550684d26258',
};

const VALID_TEAMS = new Set([
  'Team: Docs',
  'Team: JavaScript SDKs',
  'Team: Web Backend SDKs',
  'Team: Mobile Platform',
  'Team: Native Platform',
  'Team: Replay',
  'Team: Crons',
  'Team: Ecosystem',
]);

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignore\s+(all\s+)?above/i,
  /disregard\s+(all\s+)?previous/i,
  /you\s+are\s+now\s+a\b/i,
  /new\s+instructions?\s*:/i,
  /reveal\s+(your|the)\s+(system\s+)?prompt/i,
  /what\s+are\s+your\s+instructions/i,
];

function detectInjection(text: string): boolean {
  return INJECTION_PATTERNS.some(p => p.test(text));
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
      execute: async args => {
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
      description:
        'Get PRs that reference a given issue number. Returns cross-referenced PRs with state (open/closed) and whether merged.',
      parameters: Type.Object({
        issueNumber: Type.Number({description: 'The issue number'}),
      }),
      execute: async args => {
        const res = await fetch(
          `https://api.github.com/repos/${REPO}/issues/${args.issueNumber}/timeline?per_page=100`,
          {headers}
        );
        const events = await res.json();
        if (!Array.isArray(events)) return JSON.stringify([]);

        const prRefs = events.filter(
          (e: Record<string, unknown>) =>
            e.event === 'cross-referenced' && (e as any).source?.issue?.pull_request
        );

        const prs = await Promise.all(
          prRefs.map(async (e: any) => {
            const prNum = e.source.issue.number;
            const prRes = await fetch(
              `https://api.github.com/repos/${REPO}/pulls/${prNum}`,
              {headers}
            );
            const pr = (await prRes.json()) as Record<string, unknown>;
            return {
              number: prNum,
              title: pr.title ?? e.source.issue.title,
              state: pr.state,
              merged: pr.merged === true,
            };
          })
        );

        return JSON.stringify(prs);
      },
    },
  ];
}

async function fetchIssue(token: string, issueNumber: number): Promise<GitHubIssue> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/issues/${issueNumber}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as GitHubIssue;
}

async function linearQuery(
  apiKey: string,
  query: string,
  variables: Record<string, unknown>
): Promise<any> {
  try {
    const res = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers: {Authorization: apiKey, 'Content-Type': 'application/json'},
      body: JSON.stringify({query, variables}),
    });
    const json = (await res.json()) as any;
    if (json.errors) {
      console.error('Linear error:', JSON.stringify(json.errors));
    }
    return json;
  } catch (e) {
    console.error('Linear request failed:', e);
    return {errors: [{message: String(e)}]};
  }
}

async function applyTriage(
  env: Record<string, string>,
  issue: GitHubIssue,
  data: {priority: string; linearLabel: string; team?: string; triageReport: string}
) {
  const token = env.GH_TOKEN ?? '';
  const ghHeaders = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github+json',
  };

  // --- Apply missing GitHub labels (allowlisted only) ---
  const existingLabels = new Set(issue.labels.map(l => l.name));
  if (data.team && VALID_TEAMS.has(data.team) && !existingLabels.has(data.team)) {
    await fetch(`https://api.github.com/repos/${REPO}/issues/${issue.number}/labels`, {
      method: 'POST',
      headers: {...ghHeaders, 'Content-Type': 'application/json'},
      body: JSON.stringify({labels: [data.team]}),
    }).catch(e => console.error('GitHub label error:', e));
  }

  // --- Try Linear update ---
  let linearOk = false;
  if (env.LINEAR_API_KEY) {
    const search = await linearQuery(
      env.LINEAR_API_KEY,
      `query($filter: IssueFilter) {
        issues(filter: $filter, first: 1) {
          nodes { id identifier labels { nodes { id } } comments { nodes { body } } }
        }
      }`,
      {
        filter: {
          team: {key: {eq: 'DOCS'}},
          attachments: {url: {contains: `sentry-docs/issues/${issue.number}`}},
        },
      }
    );

    const linearIssue = search?.data?.issues?.nodes?.[0];
    if (linearIssue) {
      const hasTriageComment = linearIssue.comments?.nodes?.some((c: any) =>
        c.body?.includes('Auto-triage report')
      );

      if (hasTriageComment) {
        console.log(`Already triaged on Linear: ${linearIssue.identifier}`);
        linearOk = true;
      } else {
        const existingLabelIds = new Set(
          (linearIssue.labels?.nodes ?? []).map((l: any) => l.id as string)
        );
        const labelId = LINEAR_LABEL_IDS[data.linearLabel];

        const mutations: Array<Promise<any>> = [
          linearQuery(
            env.LINEAR_API_KEY,
            `mutation($id: String!, $input: IssueUpdateInput!) {
              issueUpdate(id: $id, input: $input) { success }
            }`,
            {id: linearIssue.id, input: {priority: PRIORITY_MAP[data.priority] ?? 3}}
          ),
          linearQuery(
            env.LINEAR_API_KEY,
            `mutation($input: CommentCreateInput!) {
              commentCreate(input: $input) { success }
            }`,
            {
              input: {
                issueId: linearIssue.id,
                body: `🤖 **Auto-triage report**\n\n${data.triageReport}`,
              },
            }
          ),
        ];

        if (labelId && !existingLabelIds.has(labelId)) {
          mutations.push(
            linearQuery(
              env.LINEAR_API_KEY,
              `mutation($id: String!, $labelId: String!) {
                issueAddLabel(id: $id, labelId: $labelId) { success }
              }`,
              {id: linearIssue.id, labelId}
            )
          );
        }

        const results = await Promise.all(mutations);
        const commentResult = results[1];
        linearOk = commentResult?.data?.commentCreate?.success === true;

        if (linearOk) {
          console.log(`Triaged on Linear: ${linearIssue.identifier}`);
        } else {
          console.error(`Linear comment may have failed for ${linearIssue.identifier}`);
        }
      }
    } else {
      console.log('Linear ticket not found (sync may be pending)');
    }
  }

  // --- Fallback: post to GitHub only if Linear didn't work ---
  // No TRIAGE_MARKER so re-runs can retry Linear when ticket exists
  if (!linearOk) {
    const commentsRes = await fetch(
      `https://api.github.com/repos/${REPO}/issues/${issue.number}/comments?per_page=100`,
      {headers: ghHeaders}
    );
    const comments = (await commentsRes.json()) as any[];
    const alreadyPosted =
      Array.isArray(comments) && comments.some(c => c.body?.includes(TRIAGE_MARKER));

    if (!alreadyPosted) {
      await fetch(
        `https://api.github.com/repos/${REPO}/issues/${issue.number}/comments`,
        {
          method: 'POST',
          headers: {...ghHeaders, 'Content-Type': 'application/json'},
          body: JSON.stringify({
            body: `${TRIAGE_MARKER}\n🤖 **Auto-triage report**\n\n${data.triageReport}`,
          }),
        }
      ).catch(e => console.error('GitHub comment error:', e));
      console.log(`Triaged on GitHub: #${issue.number} (Linear unavailable)`);
    } else {
      console.log(`Already triaged on GitHub: #${issue.number}`);
    }
  }
}

export default async function triageIssue({init, payload, env}: FlueContext) {
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
      summary: `Issue #${issue.number} flagged for potential prompt injection. Skipping AI triage.`,
    };
  }

  const agent = await init({
    model: 'anthropic/claude-sonnet-4-6',
    sandbox: local(),
    tools: githubTools(token),
  });

  const session = await agent.session();

  const {data} = await session.skill('classify-docs-issue', {
    args: {
      issueNumber: issue.number,
      title: issue.title,
      body: issue.body ?? '',
      labels: issue.labels.map(l => l.name),
      author: issue.user.login,
      createdAt: issue.created_at,
    },
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
      team: v.optional(
        v.picklist([
          'Team: Docs',
          'Team: JavaScript SDKs',
          'Team: Web Backend SDKs',
          'Team: Mobile Platform',
          'Team: Native Platform',
          'Team: Replay',
          'Team: Crons',
          'Team: Ecosystem',
        ])
      ),
      priority: v.picklist(['urgent', 'high', 'medium', 'low']),
      effort: v.picklist(['small', 'medium', 'large']),
      summary: v.string(),
      relatedDocs: v.array(v.string()),
      linearLabel: v.picklist(['Docs Content', 'Docs Platform']),
      triageReport: v.string(),
    }),
  });

  await applyTriage(env, issue, data);

  return data;
}
