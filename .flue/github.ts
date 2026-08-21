import {execFile} from 'node:child_process';

import {defineTool} from '@flue/runtime';
import * as v from 'valibot';

import {
  type GitHubIssueContext,
  GitHubIssueContextSchema,
  inferTemplate,
  parseIssueForm,
  parseLinearLinkback,
} from './triage';

const REPOSITORY = 'getsentry/sentry-docs';
const API_ROOT = 'https://api.github.com';

interface GitHubIssueResponse {
  number: number;
  title: string;
  body: string | null;
  labels: Array<{name: string}>;
  user: {login: string; type: string};
  author_association: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  html_url: string;
}

interface GitHubCommentResponse {
  user: {login: string; type: string};
  body: string;
  created_at: string;
  html_url: string;
}

interface GitHubPullResponse {
  number: number;
  title: string;
  state: 'open' | 'closed';
  merged: boolean;
  updated_at: string;
  html_url: string;
  base: {repo: {full_name: string}};
}

interface GitHubGraphQLPullResponse {
  number: number;
  title: string;
  state: 'OPEN' | 'CLOSED' | 'MERGED';
  merged: boolean;
  updatedAt: string;
  url: string;
  baseRepository: {nameWithOwner: string} | null;
}

interface GitHubTimelineEvent {
  event: string;
  created_at?: string;
  actor?: {login: string; type: string};
  source?: {issue?: {pull_request?: {url?: string}}};
}

function headers(token?: string): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? {Authorization: `Bearer ${token}`} : {}),
  };
}

async function fetchJson<T>(url: string, token?: string): Promise<T> {
  const response = await fetch(url, {headers: headers(token)});
  if (!response.ok) {
    throw new Error(
      `GitHub API error for ${url}: ${response.status} ${response.statusText}`
    );
  }
  return (await response.json()) as T;
}

async function githubRequest<T>(
  url: string,
  token: string,
  init: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {...headers(token), 'Content-Type': 'application/json', ...init.headers},
  });
  if (!response.ok) {
    throw new Error(
      `GitHub API error for ${url}: ${response.status} ${response.statusText}`
    );
  }
  return response.status === 204 ? (undefined as T) : ((await response.json()) as T);
}

async function fetchPaginated<T>(url: string, token?: string): Promise<T[]> {
  const maxPages = 100;
  const results: T[] = [];
  const pageUrl = new URL(url);
  pageUrl.searchParams.set('per_page', '100');

  for (let page = 1; page <= maxPages; page += 1) {
    pageUrl.searchParams.set('page', String(page));
    const values = await fetchJson<T[]>(pageUrl.toString(), token);
    results.push(...values);
    if (values.length < 100) return results;
  }
  throw new Error(`GitHub pagination exceeded ${maxPages} pages for ${url}.`);
}

async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, unknown>,
  token: string
): Promise<T> {
  const response = await fetch(`${API_ROOT}/graphql`, {
    method: 'POST',
    headers: {...headers(token), 'Content-Type': 'application/json'},
    body: JSON.stringify({query, variables}),
  });
  const result = (await response.json()) as {
    data?: T;
    errors?: Array<{message: string}>;
  };
  if (!response.ok || result.errors) {
    throw new Error(
      `GitHub GraphQL error: ${response.status} ${JSON.stringify(result.errors ?? [])}`
    );
  }
  if (!result.data) throw new Error('GitHub GraphQL response did not contain data.');
  return result.data;
}

async function closingPullRequests(
  issueNumber: number,
  token?: string
): Promise<GitHubIssueContext['linkedPullRequests']> {
  if (!token) return [];
  const result = await fetchGraphQL<{
    repository?: {
      issue?: {
        closedByPullRequestsReferences?: {nodes?: GitHubGraphQLPullResponse[]};
      };
    };
  }>(
    `query($owner: String!, $name: String!, $number: Int!) {
      repository(owner: $owner, name: $name) {
        issue(number: $number) {
          closedByPullRequestsReferences(first: 100, includeClosedPrs: true) {
            nodes {
              number title state merged updatedAt url
              baseRepository { nameWithOwner }
            }
          }
        }
      }
    }`,
    {owner: 'getsentry', name: 'sentry-docs', number: issueNumber},
    token
  );
  const pulls = result.repository?.issue?.closedByPullRequestsReferences?.nodes ?? [];
  return pulls.map(pull => ({
    repository: pull.baseRepository?.nameWithOwner ?? REPOSITORY,
    number: pull.number,
    title: pull.title,
    state: pull.state === 'OPEN' ? ('open' as const) : ('closed' as const),
    merged: pull.merged,
    relationship: 'closing' as const,
    updatedAt: pull.updatedAt,
    url: pull.url,
  }));
}

function truncate(value: string, length: number): string {
  return value.length <= length ? value : `${value.slice(0, length)}\n[truncated]`;
}

function latestHumanActivity(
  issue: GitHubIssueResponse,
  comments: GitHubCommentResponse[],
  timeline: GitHubTimelineEvent[],
  pulls: GitHubIssueContext['linkedPullRequests']
): string {
  const dates = [issue.created_at];
  for (const comment of comments) {
    if (comment.user.type !== 'Bot' && !comment.user.login.endsWith('[bot]')) {
      dates.push(comment.created_at);
    }
  }
  const qualifyingEvents = new Set([
    'assigned',
    'closed',
    'connected',
    'edited',
    'labeled',
    'mentioned',
    'reopened',
    'unassigned',
    'unlabeled',
  ]);
  for (const event of timeline) {
    if (
      event.created_at &&
      event.actor &&
      event.actor.type !== 'Bot' &&
      !event.actor.login.endsWith('[bot]') &&
      qualifyingEvents.has(event.event)
    ) {
      dates.push(event.created_at);
    }
  }
  for (const pull of pulls) {
    if (pull.relationship === 'closing') dates.push(pull.updatedAt);
  }
  return dates.sort().at(-1) ?? issue.created_at;
}

async function linkedPullRequests(
  issueNumber: number,
  timeline: GitHubTimelineEvent[],
  token?: string
): Promise<GitHubIssueContext['linkedPullRequests']> {
  const closingPulls = await closingPullRequests(issueNumber, token);
  const pullUrls = new Set<string>();

  for (const event of timeline) {
    const url = event.source?.issue?.pull_request?.url;
    if (event.event === 'cross-referenced' && url) pullUrls.add(url);
  }

  const pulls = await Promise.all(
    [...pullUrls].map(url => fetchJson<GitHubPullResponse>(url, token))
  );
  const closingKeys = new Set(
    closingPulls.map(pull => `${pull.repository}#${pull.number}`)
  );
  return [
    ...closingPulls,
    ...pulls
      .filter(pull => !closingKeys.has(`${pull.base.repo.full_name}#${pull.number}`))
      .map(pull => ({
        repository: pull.base.repo.full_name,
        number: pull.number,
        title: pull.title,
        state: pull.state,
        merged: pull.merged,
        relationship: 'reference' as const,
        updatedAt: pull.updated_at,
        url: pull.html_url,
      })),
  ];
}

export async function fetchIssueContext(
  issueNumber: number,
  token = process.env.GH_TOKEN
): Promise<GitHubIssueContext> {
  const [issue, comments, timeline] = await Promise.all([
    fetchJson<GitHubIssueResponse>(
      `${API_ROOT}/repos/${REPOSITORY}/issues/${issueNumber}`,
      token
    ),
    fetchPaginated<GitHubCommentResponse>(
      `${API_ROOT}/repos/${REPOSITORY}/issues/${issueNumber}/comments`,
      token
    ),
    fetchPaginated<GitHubTimelineEvent>(
      `${API_ROOT}/repos/${REPOSITORY}/issues/${issueNumber}/timeline`,
      token
    ),
  ]);
  const pulls = await linkedPullRequests(issueNumber, timeline, token);
  const body = truncate(issue.body ?? '', 20_000);
  const linearLinkback = parseLinearLinkback(
    comments.map(comment => ({author: comment.user.login, body: comment.body}))
  );
  const normalizedComments = comments.slice(-100).map(comment => ({
    author: comment.user.login,
    authorType: comment.user.type,
    body: truncate(comment.body, 2_000),
    createdAt: comment.created_at,
    url: comment.html_url,
  }));
  const labels = issue.labels.map(label => label.name);

  return v.parse(GitHubIssueContextSchema, {
    repository: REPOSITORY,
    number: issue.number,
    title: truncate(issue.title, 500),
    body,
    labels,
    template: inferTemplate(labels),
    formFields: parseIssueForm(body),
    author: {
      login: issue.user.login,
      association: issue.author_association,
      type: issue.user.type,
    },
    state: issue.state,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    lastQualifyingGitHubActivityAt: latestHumanActivity(issue, comments, timeline, pulls),
    url: issue.html_url,
    comments: normalizedComments,
    linkedPullRequests: pulls,
    linearLinkback,
  });
}

export async function listIssueNumbers(
  state: 'open' | 'closed' | 'all' = 'open',
  limit = Number.POSITIVE_INFINITY,
  token = process.env.GH_TOKEN
): Promise<number[]> {
  const numbers: number[] = [];
  for (let page = 1; numbers.length < limit; page += 1) {
    const values = await fetchJson<
      Array<{number: number; pull_request?: Record<string, unknown>}>
    >(
      `${API_ROOT}/repos/${REPOSITORY}/issues?state=${state}&per_page=100&page=${page}`,
      token
    );
    numbers.push(
      ...values.filter(value => !value.pull_request).map(value => value.number)
    );
    if (values.length < 100) break;
  }
  return Number.isFinite(limit) ? numbers.slice(0, limit) : numbers;
}

export async function addIssueLabels(
  issueNumber: number,
  labels: string[],
  token = process.env.GH_TOKEN
): Promise<void> {
  if (!token || labels.length === 0) return;
  await githubRequest(
    `${API_ROOT}/repos/${REPOSITORY}/issues/${issueNumber}/labels`,
    token,
    {method: 'POST', body: JSON.stringify({labels})}
  );
}

export async function removeIssueLabel(
  issueNumber: number,
  label: string,
  token = process.env.GH_TOKEN
): Promise<void> {
  if (!token) return;
  const response = await fetch(
    `${API_ROOT}/repos/${REPOSITORY}/issues/${issueNumber}/labels/${encodeURIComponent(label)}`,
    {method: 'DELETE', headers: headers(token)}
  );
  if (!response.ok && response.status !== 404) {
    throw new Error(
      `Unable to remove ${label} from #${issueNumber}: ${response.status}.`
    );
  }
}

export async function createIssueCommentOnce(
  issueNumber: number,
  marker: string,
  body: string,
  token = process.env.GH_TOKEN
): Promise<void> {
  if (!token) return;
  const comments = await fetchPaginated<GitHubCommentResponse>(
    `${API_ROOT}/repos/${REPOSITORY}/issues/${issueNumber}/comments`,
    token
  );
  if (comments.some(comment => comment.body.includes(marker))) return;
  await githubRequest(
    `${API_ROOT}/repos/${REPOSITORY}/issues/${issueNumber}/comments`,
    token,
    {method: 'POST', body: JSON.stringify({body: `${marker}\n${body}`})}
  );
}

export async function hasIssueCommentBySince(
  issueNumber: number,
  login: string,
  since: string,
  token = process.env.GH_TOKEN
): Promise<boolean> {
  const comments = await fetchPaginated<GitHubCommentResponse>(
    `${API_ROOT}/repos/${REPOSITORY}/issues/${issueNumber}/comments`,
    token
  );
  const cutoff = new Date(since).getTime();
  return comments.some(
    comment =>
      comment.user.login.toLowerCase() === login.toLowerCase() &&
      new Date(comment.created_at).getTime() > cutoff
  );
}

export async function updateIssueState(
  issueNumber: number,
  state: 'open' | 'closed',
  stateReason?: 'completed' | 'not_planned' | 'reopened',
  token = process.env.GH_TOKEN
): Promise<void> {
  if (!token) return;
  await githubRequest(`${API_ROOT}/repos/${REPOSITORY}/issues/${issueNumber}`, token, {
    method: 'PATCH',
    body: JSON.stringify({state, ...(stateReason ? {state_reason: stateReason} : {})}),
  });
}

function repositorySearch(query: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    execFile(
      'git',
      [
        'grep',
        '--line-number',
        '--ignore-case',
        '--fixed-strings',
        '--max-count=1',
        '-e',
        query,
        '--',
        'docs',
        'app',
        'src',
        'includes',
        'platform-includes',
        'redirects.js',
      ],
      {maxBuffer: 2_000_000},
      (error, stdout) => {
        if (error && error.code !== 1) {
          reject(error);
          return;
        }
        resolve(stdout.trim() ? stdout.trim().split('\n').slice(0, 20) : []);
      }
    );
  });
}

export const searchRepositoryTool = defineTool({
  name: 'search_repository',
  description:
    'Search approved sentry-docs content and application paths for a literal phrase. Returns matching file paths, line numbers, and excerpts.',
  input: v.object({
    query: v.pipe(v.string(), v.minLength(2), v.maxLength(100)),
  }),
  output: v.array(v.string()),
  async run({data}) {
    return {output: await repositorySearch(data.query)};
  },
});

export const searchIssuesTool = defineTool({
  name: 'search_issues',
  description:
    'Search sentry-docs issues for possible duplicates. Returns up to five issue numbers, titles, states, and URLs.',
  input: v.object({
    query: v.pipe(v.string(), v.minLength(2), v.maxLength(200)),
  }),
  output: v.array(
    v.object({
      number: v.number(),
      title: v.string(),
      state: v.string(),
      url: v.string(),
    })
  ),
  async run({data}) {
    const terms = sanitizeIssueSearchQuery(data.query);
    if (!terms) {
      throw new Error('Search queries must contain terms beyond GitHub qualifiers.');
    }
    const query = new URLSearchParams({
      q: `${terms} repo:${REPOSITORY} type:issue`,
      per_page: '5',
    });
    const result = await fetchJson<{
      items: Array<{number: number; title: string; state: string; html_url: string}>;
    }>(`${API_ROOT}/search/issues?${query}`, process.env.GH_TOKEN);
    return {
      output: result.items.map(item => ({
        number: item.number,
        title: item.title,
        state: item.state,
        url: item.html_url,
      })),
    };
  },
});

const GITHUB_SEARCH_QUALIFIER =
  /^-?(?:archived|assignee|author|base|closed|commenter|comments|created|draft|head|in|interactions|involves|is|label|language|linked|locked|mentions|merged|milestone|no|org|project|reactions|reason|repo|review|review-requested|reviewed-by|state|status|team|team-review-requested|type|updated|user|user-review-requested):/i;

export function sanitizeIssueSearchQuery(query: string): string {
  return query
    .split(/\s+/)
    .filter(
      term =>
        term &&
        !GITHUB_SEARCH_QUALIFIER.test(term) &&
        !['AND', 'NOT', 'OR'].includes(term)
    )
    .join(' ')
    .trim();
}
