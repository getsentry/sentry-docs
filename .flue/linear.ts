import type * as v from 'valibot';

import type {GitHubIssueContext, LinearTeamSchema, PrioritySchema} from './triage';

const LINEAR_API = 'https://api.linear.app/graphql';

export type LinearTeamName = v.InferOutput<typeof LinearTeamSchema>;
export type TriagePriority = v.InferOutput<typeof PrioritySchema>;

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface LinearUser {
  id: string;
  name: string;
  displayName?: string;
  email?: string;
  app?: boolean;
}

export interface LinearComment {
  id: string;
  body: string;
  createdAt: string;
  editedAt?: string | null;
  user?: LinearUser | null;
  externalUser?: {id: string; name: string} | null;
  botActor?: {id?: string; name?: string; type?: string} | null;
}

interface LinearHistory {
  id: string;
  createdAt: string;
  actor?: LinearUser | null;
  botActor?: {id?: string; name?: string; type?: string} | null;
}

export interface LinearWorkflowState {
  id: string;
  name: string;
  type: string;
}

export interface LinearTeam {
  id: string;
  key: string;
  name: string;
  states: LinearWorkflowState[];
}

export interface LinearIssueDetails {
  id: string;
  identifier: string;
  title: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  priority: number;
  team: {id: string; key: string; name: string};
  state: LinearWorkflowState;
  assignee: LinearUser | null;
  comments: LinearComment[];
  history: LinearHistory[];
  lastHumanActivityAt?: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{message: string}>;
}

export async function linearQuery<T>(
  apiKey: string,
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  const response = await fetch(LINEAR_API, {
    method: 'POST',
    headers: {Authorization: apiKey, 'Content-Type': 'application/json'},
    body: JSON.stringify({query, variables}),
  });
  const result = (await response.json()) as GraphQLResponse<T>;
  if (!response.ok || result.errors || !result.data) {
    throw new Error(
      `Linear API error: ${response.status} ${JSON.stringify(result.errors ?? [])}`
    );
  }
  return result.data;
}

async function issueByIdentifier(
  apiKey: string,
  identifier: string
): Promise<Omit<LinearIssueDetails, 'comments' | 'history' | 'lastHumanActivityAt'>> {
  const result = await linearQuery<{
    issue: Omit<LinearIssueDetails, 'comments' | 'history' | 'lastHumanActivityAt'>;
  }>(
    apiKey,
    `query($id: String!) {
      issue(id: $id) {
        id identifier title url priority createdAt updatedAt
        team { id key name }
        state { id name type }
        assignee { id name displayName email app }
      }
    }`,
    {id: identifier}
  );
  return result.issue;
}

async function issueByAttachment(
  apiKey: string,
  url: string
): Promise<Omit<LinearIssueDetails, 'comments' | 'history' | 'lastHumanActivityAt'>> {
  const result = await linearQuery<{
    attachmentsForURL: {
      nodes: Array<{
        issue: Omit<LinearIssueDetails, 'comments' | 'history' | 'lastHumanActivityAt'>;
      }>;
    };
  }>(
    apiKey,
    `query($url: String!) {
      attachmentsForURL(url: $url, first: 50, includeArchived: true) {
        nodes {
          issue {
            id identifier title url priority createdAt updatedAt
            team { id key name }
            state { id name type }
            assignee { id name displayName email app }
          }
        }
      }
    }`,
    {url}
  );
  const issues = new Map(
    result.attachmentsForURL.nodes.map(node => [node.issue.id, node.issue])
  );
  if (issues.size !== 1) {
    throw new Error(`Expected one Linear issue for ${url}, found ${issues.size}.`);
  }
  return [...issues.values()][0];
}

async function issueActivity(
  apiKey: string,
  issueId: string
): Promise<{comments: LinearComment[]; history: LinearHistory[]}> {
  return {
    comments: await issueComments(apiKey, issueId),
    history: await issueHistory(apiKey, issueId),
  };
}

async function issueComments(apiKey: string, issueId: string): Promise<LinearComment[]> {
  const comments: LinearComment[] = [];
  let after: string | null = null;

  for (let page = 0; page < 100; page += 1) {
    const result = await linearQuery<{
      issue: {
        comments: {nodes: LinearComment[]; pageInfo: PageInfo};
      };
    }>(
      apiKey,
      `query($id: String!, $after: String) {
        issue(id: $id) {
          comments(first: 100, after: $after, includeArchived: true) {
            nodes {
              id body createdAt editedAt
              user { id name displayName email app }
              externalUser { id name }
              botActor { id name type }
            }
            pageInfo { hasNextPage endCursor }
          }
        }
      }`,
      {id: issueId, after}
    );
    comments.push(...result.issue.comments.nodes);
    after = result.issue.comments.pageInfo.hasNextPage
      ? result.issue.comments.pageInfo.endCursor
      : null;
    if (!after) return comments;
  }
  throw new Error(`Linear comment pagination exceeded 100 pages for ${issueId}.`);
}

async function issueHistory(apiKey: string, issueId: string): Promise<LinearHistory[]> {
  const history: LinearHistory[] = [];
  let after: string | null = null;
  for (let page = 0; page < 100; page += 1) {
    const result = await linearQuery<{
      issue: {history: {nodes: LinearHistory[]; pageInfo: PageInfo}};
    }>(
      apiKey,
      `query($id: String!, $after: String) {
        issue(id: $id) {
          history(first: 100, after: $after, includeArchived: true) {
            nodes {
              id createdAt
              actor { id name displayName email app }
              botActor { id name type }
            }
            pageInfo { hasNextPage endCursor }
          }
        }
      }`,
      {id: issueId, after}
    );
    history.push(...result.issue.history.nodes);
    after = result.issue.history.pageInfo.hasNextPage
      ? result.issue.history.pageInfo.endCursor
      : null;
    if (!after) return history;
  }
  throw new Error(`Linear history pagination exceeded 100 pages for ${issueId}.`);
}

function latestHumanActivity(
  issue: {createdAt: string},
  comments: LinearComment[],
  history: LinearHistory[]
): string | undefined {
  const dates = [issue.createdAt];
  for (const comment of comments) {
    if ((comment.user && !comment.user.app) || comment.externalUser) {
      dates.push(comment.editedAt ?? comment.createdAt);
    }
  }
  for (const entry of history) {
    if (entry.actor && !entry.actor.app) dates.push(entry.createdAt);
  }
  return dates.sort().at(-1);
}

export async function fetchLinearIssue(
  apiKey: string,
  issue: GitHubIssueContext
): Promise<LinearIssueDetails> {
  let core: Omit<LinearIssueDetails, 'comments' | 'history' | 'lastHumanActivityAt'>;
  if (issue.linearLinkback) {
    try {
      core = await issueByIdentifier(apiKey, issue.linearLinkback.identifier);
    } catch {
      core = await issueByAttachment(apiKey, issue.url);
    }
  } else {
    core = await issueByAttachment(apiKey, issue.url);
  }
  const activity = await issueActivity(apiKey, core.id);
  return {
    ...core,
    ...activity,
    lastHumanActivityAt: latestHumanActivity(core, activity.comments, activity.history),
  };
}

export async function fetchLinearTeams(apiKey: string): Promise<LinearTeam[]> {
  const teams: LinearTeam[] = [];
  let after: string | null = null;
  for (let page = 0; page < 100; page += 1) {
    const result = await linearQuery<{
      teams: {
        nodes: Array<{
          id: string;
          key: string;
          name: string;
          states: {nodes: LinearWorkflowState[]};
        }>;
        pageInfo: PageInfo;
      };
    }>(
      apiKey,
      `query($after: String) {
        teams(first: 100, after: $after, includeArchived: false) {
          nodes {
            id key name
            states(first: 100, includeArchived: false) { nodes { id name type } }
          }
          pageInfo { hasNextPage endCursor }
        }
      }`,
      {after}
    );
    teams.push(...result.teams.nodes.map(team => ({...team, states: team.states.nodes})));
    after = result.teams.pageInfo.hasNextPage ? result.teams.pageInfo.endCursor : null;
    if (!after) return teams;
  }
  throw new Error('Linear team pagination exceeded 100 pages.');
}

interface TeamConfig {
  linearTeams: Record<string, {keys: string[]; names: string[]}>;
  teamMentions: Record<string, string>;
}

export function resolveLinearTeam(
  teams: LinearTeam[],
  target: LinearTeamName,
  config: TeamConfig
): LinearTeam {
  const expected = config.linearTeams[target];
  const matches = teams.filter(
    team =>
      expected.keys.some(key => key.toLowerCase() === team.key.toLowerCase()) ||
      expected.names.some(name => name.toLowerCase() === team.name.toLowerCase())
  );
  if (matches.length !== 1) {
    throw new Error(`Expected one Linear team for ${target}, found ${matches.length}.`);
  }
  return matches[0];
}

export function priorityNumber(priority: TriagePriority): 0 | 1 | 2 | 3 | 4 {
  return {none: 0, urgent: 1, high: 2, medium: 3, low: 4}[priority] as 0 | 1 | 2 | 3 | 4;
}

export async function updateLinearIssue(
  apiKey: string,
  issueId: string,
  input: {
    teamId?: string;
    stateId?: string;
    priority?: 0 | 1 | 2 | 3 | 4;
    assigneeId?: string | null;
  }
): Promise<LinearIssueDetails> {
  const result = await linearQuery<{
    issueUpdate: {success: boolean; issue: LinearIssueDetails};
  }>(
    apiKey,
    `mutation($id: String!, $input: IssueUpdateInput!) {
      issueUpdate(id: $id, input: $input) {
        success
        issue {
          id identifier title url priority createdAt updatedAt
          team { id key name }
          state { id name type }
          assignee { id name displayName email app }
        }
      }
    }`,
    {id: issueId, input}
  );
  if (!result.issueUpdate.success)
    throw new Error(`Linear issue update failed for ${issueId}.`);
  return result.issueUpdate.issue;
}

export async function createLinearCommentOnce(
  apiKey: string,
  issue: LinearIssueDetails,
  marker: string,
  body: string
): Promise<void> {
  if (issue.comments.some(comment => comment.body.includes(marker))) return;
  const result = await linearQuery<{commentCreate: {success: boolean}}>(
    apiKey,
    `mutation($input: CommentCreateInput!) {
      commentCreate(input: $input) { success }
    }`,
    {input: {issueId: issue.id, body: `${marker}\n${body}`}}
  );
  if (!result.commentCreate.success)
    throw new Error(`Linear comment failed for ${issue.id}.`);
}

export function stateByType(team: LinearTeam, type: string): LinearWorkflowState {
  const matches = team.states.filter(
    state =>
      state.type === type &&
      (type !== 'canceled' || state.name.toLowerCase() === 'canceled')
  );
  if (matches.length !== 1) {
    throw new Error(
      `Expected one ${type} state for ${team.name}, found ${matches.length}.`
    );
  }
  return matches[0];
}

export function toLinearContext(issue: LinearIssueDetails): GitHubIssueContext['linear'] {
  return {
    id: issue.id,
    identifier: issue.identifier,
    teamId: issue.team.id,
    teamKey: issue.team.key,
    teamName: issue.team.name,
    stateId: issue.state.id,
    stateName: issue.state.name,
    stateType: issue.state.type,
    priority: issue.priority,
    assigneeId: issue.assignee?.id,
    lastHumanActivityAt: issue.lastHumanActivityAt,
  };
}
