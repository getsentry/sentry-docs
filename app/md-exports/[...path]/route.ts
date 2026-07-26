import {readFile} from 'node:fs/promises';
import {join} from 'node:path';

import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';
import {AI_AGENT_PATTERN, matchPattern} from 'sentry-docs/lib/trafficClassification';
import {DocMetrics} from 'sentry-docs/metrics';

interface DocTreeNode {
  path: string;
  slug: string;
  frontmatter: {title?: string; description?: string};
  children?: DocTreeNode[];
}

const BASE_URL = isDeveloperDocs
  ? 'https://develop.sentry.dev'
  : 'https://docs.sentry.io';

let cachedDocTree: DocTreeNode | null = null;

async function getDocTree(): Promise<DocTreeNode> {
  if (cachedDocTree) {
    return cachedDocTree;
  }
  const filename = isDeveloperDocs ? 'doctree-dev.json' : 'doctree.json';
  const treePath = join(process.cwd(), 'public', filename);
  const raw = await readFile(treePath, 'utf-8');
  cachedDocTree = JSON.parse(raw) as DocTreeNode;
  return cachedDocTree;
}

function findNode(node: DocTreeNode, targetPath: string): DocTreeNode | null {
  if (node.path === targetPath) {
    return node;
  }
  for (const child of node.children ?? []) {
    const found = findNode(child, targetPath);
    if (found) {
      return found;
    }
  }
  return null;
}

function findClosestAncestor(
  tree: DocTreeNode,
  pathSegments: string[]
): DocTreeNode | null {
  for (let i = pathSegments.length; i > 0; i--) {
    const candidatePath = pathSegments.slice(0, i).join('/');
    const node = findNode(tree, candidatePath);
    if (node) {
      return node;
    }
  }
  return null;
}

function renderSiblingList(siblings: DocTreeNode[], baseUrl: string): string {
  return siblings
    .slice(0, 15)
    .map(s => {
      const title = s.frontmatter?.title || s.slug;
      return `- [${title}](${baseUrl}/${s.path}.md)`;
    })
    .join('\n');
}

export async function GET(
  request: Request,
  {params}: {params: Promise<{path: string[]}>}
) {
  const {path: pathSegments} = await params;
  const requestedPath = pathSegments.join('/').replace(/\.md$/, '');

  let body: string;
  let hasSuggestions = false;

  try {
    const tree = await getDocTree();
    const ancestor = findClosestAncestor(tree, requestedPath.split('/'));

    const lines: string[] = [
      '---',
      `title: "Page Not Found"`,
      `url: "${BASE_URL}/${requestedPath}"`,
      '---',
      '',
      '# Page Not Found',
      '',
      `The page \`/${requestedPath}\` does not exist.`,
      '',
    ];

    if (ancestor && ancestor.children?.length) {
      hasSuggestions = true;
      const ancestorTitle =
        ancestor.frontmatter?.title || ancestor.slug || 'this section';
      lines.push(`## Pages in ${ancestorTitle}`);
      lines.push('');
      lines.push(renderSiblingList(ancestor.children, BASE_URL));
      lines.push('');
    }

    lines.push('## Find what you need');
    lines.push('');
    lines.push(`- [Site index](${BASE_URL}/llms.txt) — LLM-optimized page listing`);
    lines.push(`- [Documentation root](${BASE_URL}/index.md) — full docs overview`);
    lines.push(`- [Platforms](${BASE_URL}/platforms.md) — all SDK platforms`);
    lines.push('');

    body = lines.join('\n');
  } catch {
    body = [
      '---',
      `title: "Page Not Found"`,
      `url: "${BASE_URL}/${requestedPath}"`,
      '---',
      '',
      '# Page Not Found',
      '',
      `The page \`/${requestedPath}\` does not exist.`,
      '',
      '## Find what you need',
      '',
      `- [Site index](${BASE_URL}/llms.txt) — LLM-optimized page listing`,
      `- [Documentation root](${BASE_URL}/index.md) — full docs overview`,
      `- [Platforms](${BASE_URL}/platforms.md) — all SDK platforms`,
      '',
    ].join('\n');
  }

  // Normalize the agent to a low-cardinality name (e.g. "claude", "gptbot") rather
  // than the raw User-Agent, matching the convention in tracesSampler.ts.
  const agent =
    matchPattern(request.headers.get('user-agent') ?? '', AI_AGENT_PATTERN) ?? 'other';

  // Track the full invented URL by agent so we can see which agents make up which
  // pages most (and whether the soft-404 had suggestions to offer them).
  DocMetrics.mdExportNotFound(requestedPath.split('/'), hasSuggestions, agent);

  // Return 200 (not 404) on purpose. This route serves a Markdown "page not found"
  // helper that links to real nearby pages so AI agents can self-correct. Many agent
  // fetchers — including Claude Code's WebFetch (User-Agent "Claude-User") — discard the
  // response body on any non-2xx status, so a 404 strips exactly the recovery content we
  // want agents to read, leaving them with "0 bytes". The not-found signal is preserved
  // in the body ("# Page Not Found"); we mark the response noindex so crawlers don't
  // treat it as real content, and expose X-Sentry-Docs-Not-Found so monitoring can still
  // distinguish these soft misses from genuine hits.
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'X-Robots-Tag': 'noindex',
      'X-Sentry-Docs-Not-Found': '1',
    },
  });
}
