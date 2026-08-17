const COMMENT_MARKER = '<!-- docs-preview-links -->';
const GITHUB_API_URL = 'https://api.github.com';
const MAX_LINKS_PER_SOURCE = 8;
const MAX_VISIBLE_LINKS = 30;

type ChangedFileStatus =
  | 'added'
  | 'changed'
  | 'modified'
  | 'removed'
  | 'renamed'
  | string;

interface ChangedFile {
  filename: string;
  status: ChangedFileStatus;
}

interface DocTreeNode {
  children?: DocTreeNode[];
  frontmatter?: {
    title?: string;
  };
  path?: string;
  sourcePath?: string;
}

interface IssueComment {
  body?: string;
  id: number;
  user?: {
    type?: string;
  };
}

interface PreviewPage {
  path: string;
  title: string;
  url: string;
}

interface PreviewLinkGroup {
  affectedPageCount: number;
  filePath: string;
  pages: PreviewPage[];
}

interface PullRequest {
  number: number;
  state: string;
  updated_at?: string;
}

interface RunConfig {
  deploymentSha: string;
  deploymentUrl: string;
  githubRepository: string;
  githubToken: string;
}

interface GitHubClient {
  createIssueComment(issueNumber: number, body: string): Promise<void>;
  listIssueComments(issueNumber: number): Promise<IssueComment[]>;
  listPullRequestFiles(pullNumber: number): Promise<ChangedFile[]>;
  listPullRequestsForCommit(commitSha: string): Promise<PullRequest[]>;
  updateIssueComment(commentId: number, body: string): Promise<void>;
}

function assertRequiredEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function getRunConfig(env: NodeJS.ProcessEnv = process.env): RunConfig {
  return {
    deploymentSha: assertRequiredEnv('DEPLOYMENT_SHA', env.DEPLOYMENT_SHA),
    deploymentUrl: assertRequiredEnv('DEPLOYMENT_URL', env.DEPLOYMENT_URL),
    githubRepository: assertRequiredEnv('GITHUB_REPOSITORY', env.GITHUB_REPOSITORY),
    githubToken: assertRequiredEnv('GITHUB_TOKEN', env.GITHUB_TOKEN),
  };
}

function normalizePreviewUrl(url: string): string {
  const withProtocol = /^https?:\/\//.test(url) ? url : `https://${url}`;
  return withProtocol.replace(/\/+$/, '');
}

function normalizePagePath(pagePath: string): string {
  return pagePath.replace(/^\/+|\/+$/g, '');
}

function pagePathToUrl(previewUrl: string, pagePath: string): string {
  const normalizedPath = normalizePagePath(pagePath);
  return normalizedPath ? `${previewUrl}/${normalizedPath}/` : `${previewUrl}/`;
}

function isRelevantDocsFile(file: ChangedFile): boolean {
  if (file.status === 'removed') {
    return false;
  }

  if (!/\.(md|mdx)$/.test(file.filename)) {
    return false;
  }

  return (
    file.filename.startsWith('docs/') ||
    file.filename.startsWith('develop-docs/') ||
    file.filename.startsWith('includes/') ||
    file.filename.startsWith('platform-includes/')
  );
}

function getRelevantChangedFiles(files: ChangedFile[]): ChangedFile[] {
  const seen = new Set<string>();
  const relevantFiles: ChangedFile[] = [];

  for (const file of files) {
    if (!isRelevantDocsFile(file) || seen.has(file.filename)) {
      continue;
    }

    seen.add(file.filename);
    relevantFiles.push(file);
  }

  return relevantFiles.sort((a, b) => a.filename.localeCompare(b.filename));
}

function flattenDocTree(node: DocTreeNode): DocTreeNode[] {
  const nodes: DocTreeNode[] = [];

  if (typeof node.path === 'string' && Array.isArray(node.children)) {
    nodes.push(node);
  }

  for (const child of node.children ?? []) {
    nodes.push(...flattenDocTree(child));
  }

  return nodes;
}

function buildSourcePathIndex(nodes: DocTreeNode[]): Map<string, PreviewPage[]> {
  const index = new Map<string, PreviewPage[]>();
  const seenPathsBySource = new Map<string, Set<string>>();

  for (const node of nodes) {
    if (!node.sourcePath || typeof node.path !== 'string') {
      continue;
    }

    const sourcePath = node.sourcePath;
    const pagePath = normalizePagePath(node.path);
    const seenPaths = seenPathsBySource.get(sourcePath) ?? new Set<string>();
    if (seenPaths.has(pagePath)) {
      continue;
    }

    seenPaths.add(pagePath);
    seenPathsBySource.set(sourcePath, seenPaths);

    const pages = index.get(sourcePath) ?? [];
    pages.push({
      path: pagePath,
      title: node.frontmatter?.title || `/${pagePath}/`,
      url: '',
    });
    index.set(sourcePath, pages);
  }

  for (const pages of index.values()) {
    pages.sort((a, b) => {
      const depthDiff = a.path.split('/').length - b.path.split('/').length;
      if (depthDiff !== 0) {
        return depthDiff;
      }
      return a.path.localeCompare(b.path);
    });
  }

  return index;
}

function createPreviewLinkGroups(
  files: ChangedFile[],
  sourcePathIndex: Map<string, PreviewPage[]>,
  previewUrl: string
): PreviewLinkGroup[] {
  return getRelevantChangedFiles(files).map(file => {
    const pages = (sourcePathIndex.get(file.filename) ?? []).map(page => ({
      ...page,
      url: pagePathToUrl(previewUrl, page.path),
    }));

    return {
      affectedPageCount: pages.length,
      filePath: file.filename,
      pages,
    };
  });
}

function formatPageLabel(page: PreviewPage): string {
  return page.path ? `${page.title} - /${page.path}/` : page.title;
}

function renderPreviewComment({
  deploymentSha,
  groups,
  previewUrl,
}: {
  deploymentSha: string;
  groups: PreviewLinkGroup[];
  previewUrl: string;
}): string {
  const directGroups = groups.filter(group => group.pages.length > 0);
  const noDirectGroups = groups.filter(group => group.pages.length === 0);
  const lines: string[] = [
    COMMENT_MARKER,
    '## Changed Docs Preview Links',
    '',
    `Preview deployment: ${previewUrl}`,
    `Commit: \`${deploymentSha.slice(0, 12)}\``,
    '',
  ];

  if (directGroups.length > 0) {
    lines.push('### Direct Preview Pages', '');
    let remainingVisibleLinks = MAX_VISIBLE_LINKS;

    for (const group of directGroups) {
      const visibleCount = Math.min(
        MAX_LINKS_PER_SOURCE,
        remainingVisibleLinks,
        group.pages.length
      );
      const visiblePages = group.pages.slice(0, visibleCount);
      const hiddenCount = group.pages.length - visiblePages.length;
      const pageText =
        group.affectedPageCount === 1
          ? 'affects 1 page'
          : `affects ${group.affectedPageCount} pages`;

      lines.push(`- \`${group.filePath}\` (${pageText})`);

      if (visiblePages.length === 0) {
        lines.push('  - Additional links hidden to keep this comment readable.');
      }

      for (const page of visiblePages) {
        lines.push(`  - [${formatPageLabel(page)}](${page.url})`);
      }

      if (hiddenCount > 0) {
        lines.push(`  - ...and ${hiddenCount} more.`);
      }

      remainingVisibleLinks -= visiblePages.length;
    }

    lines.push('');
  }

  if (noDirectGroups.length > 0) {
    lines.push('### No Direct Preview URL Found', '');
    lines.push(
      'These changed docs files do not map directly to a public doctree page in this preview.'
    );
    lines.push('');

    for (const group of noDirectGroups) {
      lines.push(`- \`${group.filePath}\``);
    }

    lines.push('');
  }

  lines.push('_Generated from the successful Vercel preview deployment for this PR._');

  return lines.join('\n');
}

function selectPullRequest(pulls: PullRequest[]): PullRequest | undefined {
  const sortedPulls = [...pulls].sort((a, b) => {
    if (a.state === b.state) {
      return (b.updated_at ?? '').localeCompare(a.updated_at ?? '');
    }
    return a.state === 'open' ? -1 : 1;
  });

  return sortedPulls[0];
}

function getExistingPreviewComment(comments: IssueComment[]): IssueComment | undefined {
  return comments.find(
    comment => comment.user?.type === 'Bot' && comment.body?.includes(COMMENT_MARKER)
  );
}

async function upsertPreviewComment(
  client: GitHubClient,
  pullNumber: number,
  body: string
): Promise<'created' | 'updated'> {
  const comments = await client.listIssueComments(pullNumber);
  const existingComment = getExistingPreviewComment(comments);

  if (existingComment) {
    await client.updateIssueComment(existingComment.id, body);
    return 'updated';
  }

  await client.createIssueComment(pullNumber, body);
  return 'created';
}

function buildApiUrl(pathname: string): string {
  return `${GITHUB_API_URL}${pathname}`;
}

class RestGitHubClient implements GitHubClient {
  private owner: string;
  private repo: string;
  private token: string;

  constructor(repository: string, token: string) {
    const [owner, repo] = repository.split('/');
    if (!owner || !repo) {
      throw new Error(`Invalid GITHUB_REPOSITORY value: ${repository}`);
    }

    this.owner = owner;
    this.repo = repo;
    this.token = token;
  }

  private async requestJson<T>(pathname: string, init?: RequestInit): Promise<T> {
    const response = await fetch(buildApiUrl(pathname), {
      ...init,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...init?.headers,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`GitHub API request failed: ${response.status} ${body}`);
    }

    return (await response.json()) as T;
  }

  private async requestPaginated<T>(pathname: string): Promise<T[]> {
    const allItems: T[] = [];

    for (let page = 1; ; page++) {
      const separator = pathname.includes('?') ? '&' : '?';
      const items = await this.requestJson<T[]>(
        `${pathname}${separator}per_page=100&page=${page}`
      );
      allItems.push(...items);

      if (items.length < 100) {
        break;
      }
    }

    return allItems;
  }

  listPullRequestsForCommit(commitSha: string): Promise<PullRequest[]> {
    return this.requestPaginated<PullRequest>(
      `/repos/${this.owner}/${this.repo}/commits/${encodeURIComponent(commitSha)}/pulls`
    );
  }

  listPullRequestFiles(pullNumber: number): Promise<ChangedFile[]> {
    return this.requestPaginated<ChangedFile>(
      `/repos/${this.owner}/${this.repo}/pulls/${pullNumber}/files`
    );
  }

  listIssueComments(issueNumber: number): Promise<IssueComment[]> {
    return this.requestPaginated<IssueComment>(
      `/repos/${this.owner}/${this.repo}/issues/${issueNumber}/comments`
    );
  }

  async createIssueComment(issueNumber: number, body: string): Promise<void> {
    await this.requestJson(
      `/repos/${this.owner}/${this.repo}/issues/${issueNumber}/comments`,
      {
        body: JSON.stringify({body}),
        method: 'POST',
      }
    );
  }

  async updateIssueComment(commentId: number, body: string): Promise<void> {
    await this.requestJson(
      `/repos/${this.owner}/${this.repo}/issues/comments/${commentId}`,
      {
        body: JSON.stringify({body}),
        method: 'PATCH',
      }
    );
  }
}

async function fetchDocTree(
  previewUrl: string,
  filename: string
): Promise<DocTreeNode | null> {
  const response = await fetch(`${previewUrl}/${filename}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Could not fetch ${filename}: ${response.status}`);
  }

  return (await response.json()) as DocTreeNode;
}

async function fetchDocTrees(previewUrl: string): Promise<DocTreeNode[]> {
  const trees: DocTreeNode[] = [];

  for (const filename of ['doctree.json', 'doctree-dev.json']) {
    const tree = await fetchDocTree(previewUrl, filename);
    if (tree) {
      trees.push(tree);
    }
  }

  if (trees.length === 0) {
    throw new Error(`Could not find doctree.json or doctree-dev.json at ${previewUrl}`);
  }

  return trees;
}

async function run(config: RunConfig = getRunConfig()): Promise<void> {
  const previewUrl = normalizePreviewUrl(config.deploymentUrl);
  const client = new RestGitHubClient(config.githubRepository, config.githubToken);
  const pullRequest = selectPullRequest(
    await client.listPullRequestsForCommit(config.deploymentSha)
  );

  if (!pullRequest) {
    console.log(`No PR found for deployment SHA ${config.deploymentSha}.`);
    return;
  }

  const changedFiles = await client.listPullRequestFiles(pullRequest.number);
  const relevantFiles = getRelevantChangedFiles(changedFiles);

  if (relevantFiles.length === 0) {
    console.log(`No docs files changed in PR #${pullRequest.number}.`);
    return;
  }

  const docTrees = await fetchDocTrees(previewUrl);
  const sourcePathIndex = buildSourcePathIndex(docTrees.flatMap(flattenDocTree));
  const groups = createPreviewLinkGroups(relevantFiles, sourcePathIndex, previewUrl);
  const body = renderPreviewComment({
    deploymentSha: config.deploymentSha,
    groups,
    previewUrl,
  });
  const action = await upsertPreviewComment(client, pullRequest.number, body);

  console.log(
    `${action === 'created' ? 'Created' : 'Updated'} PR preview links comment.`
  );
}

if (require.main === module) {
  run().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

export {
  buildSourcePathIndex,
  COMMENT_MARKER,
  createPreviewLinkGroups,
  flattenDocTree,
  getRelevantChangedFiles,
  normalizePreviewUrl,
  renderPreviewComment,
  selectPullRequest,
  upsertPreviewComment,
};
