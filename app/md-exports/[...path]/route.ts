import {readFile} from 'node:fs/promises';
import {join} from 'node:path';

import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';
import {AI_AGENT_PATTERN, matchPattern} from 'sentry-docs/lib/trafficClassification';
import {DocMetrics, MdExportMissOutcome} from 'sentry-docs/metrics';

import {DEVELOPER_DOCS_REDIRECTS, USER_DOCS_REDIRECTS} from '../../../middleware';
import {developerDocsRedirects, userDocsRedirects} from '../../../redirects';

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

let cachedRedirectLookup: Map<string, string> | null = null;

/**
 * Literal-source redirects from both redirect tables (next.config's redirects.js
 * and the middleware's legacy list), keyed by source path without trailing slash.
 * Pattern sources (`:path*` etc.) are skipped — the metric will show whether they
 * matter enough to support.
 */
function getRedirectLookup(): Map<string, string> {
  if (cachedRedirectLookup) {
    return cachedRedirectLookup;
  }
  const lookup = new Map<string, string>();
  const nextConfigRedirects = isDeveloperDocs
    ? developerDocsRedirects
    : userDocsRedirects;
  const middlewareRedirects = isDeveloperDocs
    ? DEVELOPER_DOCS_REDIRECTS
    : USER_DOCS_REDIRECTS;
  for (const {source, destination} of nextConfigRedirects) {
    if (!source.includes(':')) {
      lookup.set(normalizeRedirectPath(source), destination);
    }
  }
  for (const {from, to} of middlewareRedirects) {
    if (!from.includes(':')) {
      lookup.set(normalizeRedirectPath(from), to);
    }
  }
  cachedRedirectLookup = lookup;
  return lookup;
}

function normalizeRedirectPath(source: string): string {
  return '/' + source.replace(/^\/+/, '').replace(/\/+$/, '');
}

/**
 * The URL to advertise for a redirect destination. Internal destinations get the
 * `.md` export URL; destinations with a query string (e.g. `/platform-redirect/?next=…`)
 * and external ones are linked as-is, since no `.md` variant exists for them.
 */
function destinationUrl(destination: string): string {
  if (/^https?:\/\//.test(destination)) {
    return destination;
  }
  if (destination.includes('?') || destination.includes('#')) {
    return `${BASE_URL}${destination}`;
  }
  return `${BASE_URL}${normalizeRedirectPath(destination)}.md`;
}

function frontmatterLines(title: string, requestedPath: string): string[] {
  return ['---', `title: "${title}"`, `url: "${BASE_URL}/${requestedPath}"`, '---', ''];
}

function findWhatYouNeedLines(): string[] {
  return [
    '## Find what you need',
    '',
    `- [Site index](${BASE_URL}/llms.txt) — LLM-optimized page listing`,
    `- [Documentation root](${BASE_URL}/index.md) — full docs overview`,
    `- [Platforms](${BASE_URL}/platforms.md) — all SDK platforms`,
    '',
  ];
}

function renderMovedBody(requestedPath: string, destination: string): string {
  return [
    ...frontmatterLines('Page Moved', requestedPath),
    '# Page Moved',
    '',
    `The page \`/${requestedPath}\` has moved to:`,
    '',
    `- [${destination}](${destinationUrl(destination)})`,
    '',
    ...findWhatYouNeedLines(),
  ].join('\n');
}

function renderExportMissingBody(requestedPath: string, node: DocTreeNode): string {
  const title = node.frontmatter?.title || node.slug;
  const lines = [
    ...frontmatterLines('Markdown Export Unavailable', requestedPath),
    '# Markdown Export Unavailable',
    '',
    `The page \`/${requestedPath}\` ("${title}") exists, but its Markdown export was not available for this request. Retry shortly, or use the HTML page:`,
    '',
    `- [${title}](${BASE_URL}/${requestedPath}/)`,
    '',
  ];
  if (node.children?.length) {
    lines.push(
      `## Pages in ${title}`,
      '',
      renderSiblingList(node.children, BASE_URL),
      ''
    );
  }
  lines.push(...findWhatYouNeedLines());
  return lines.join('\n');
}

function renderNotFoundBody(requestedPath: string, ancestor: DocTreeNode | null): string {
  const lines = [
    ...frontmatterLines('Page Not Found', requestedPath),
    '# Page Not Found',
    '',
    `The page \`/${requestedPath}\` does not exist.`,
    '',
  ];
  if (ancestor && ancestor.children?.length) {
    const ancestorTitle = ancestor.frontmatter?.title || ancestor.slug || 'this section';
    lines.push(
      `## Pages in ${ancestorTitle}`,
      '',
      renderSiblingList(ancestor.children, BASE_URL),
      ''
    );
  }
  lines.push(...findWhatYouNeedLines());
  return lines.join('\n');
}

export async function GET(
  request: Request,
  {params}: {params: Promise<{path: string[]}>}
) {
  const {path: pathSegments} = await params;
  const requestedPath = pathSegments.join('/').replace(/\.md$/, '');

  let body: string;
  let hasSuggestions = false;
  let outcome: MdExportMissOutcome = 'unknown_path';

  const redirectDestination = getRedirectLookup().get(`/${requestedPath}`);

  if (redirectDestination) {
    outcome = 'redirected';
    body = renderMovedBody(requestedPath, redirectDestination);
  } else {
    try {
      const tree = await getDocTree();
      const ancestor = findClosestAncestor(tree, requestedPath.split('/'));

      if (ancestor && ancestor.path === requestedPath) {
        // The page is real — the static export is what's missing (deploy window,
        // export-pipeline gap). Very different signal from an invented URL.
        outcome = 'page_exists';
        hasSuggestions = !!ancestor.children?.length;
        body = renderExportMissingBody(requestedPath, ancestor);
      } else {
        hasSuggestions = !!(ancestor && ancestor.children?.length);
        body = renderNotFoundBody(requestedPath, ancestor);
      }
    } catch {
      body = renderNotFoundBody(requestedPath, null);
    }
  }

  // Normalize the agent to a low-cardinality name (e.g. "claude", "gptbot") rather
  // than the raw User-Agent, matching the convention in tracesSampler.ts.
  const agent =
    matchPattern(request.headers.get('user-agent') ?? '', AI_AGENT_PATTERN) ?? 'other';

  // Track the full invented URL by agent so we can see which agents make up which
  // pages most (and whether the soft-404 had suggestions to offer them).
  DocMetrics.mdExportNotFound(requestedPath.split('/'), hasSuggestions, agent, outcome);

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
      // page_exists misses are usually transient (deploy windows), so let a fixed
      // export replace the helper quickly.
      'Cache-Control':
        outcome === 'page_exists' ? 'public, max-age=60' : 'public, max-age=300',
      'X-Robots-Tag': 'noindex',
      'X-Sentry-Docs-Not-Found': '1',
    },
  });
}
