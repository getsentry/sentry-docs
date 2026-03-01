import {type DocNode, getDocsRootNode} from 'sentry-docs/docTree';
import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';
import {isVersioned} from 'sentry-docs/versioning';

export const dynamic = 'force-static';

// Slugs excluded from the doc tree walk. The product changelog
// (sentry.io/changelog/) is appended manually for both site variants.
const EXCLUDED_SLUGS = new Set([
  'changelog', // docs variant: dashboard API returns empty data
  'contributing', // not relevant for SDK/product usage
]);

const BASE_URL = isDeveloperDocs
  ? 'https://develop.sentry.dev'
  : 'https://docs.sentry.io';

const SITE_TITLE = isDeveloperDocs
  ? 'Sentry Developer Documentation'
  : 'Sentry Documentation';

const SITE_DESCRIPTION = isDeveloperDocs
  ? 'Internal documentation for developing the Sentry application, SDKs, and related services.'
  : 'Sentry is a developer-first application monitoring platform that helps developers identify and fix issues in real-time. It provides error tracking, performance monitoring, session replay, profiling, and more across all major platforms and frameworks.';

// Mirrors filterVisibleSiblings from src/docTree.ts (not exported).
function isVisible(node: DocNode): boolean {
  return (
    !node.missing &&
    !node.frontmatter.sidebar_hidden &&
    !node.frontmatter.draft &&
    !!node.path &&
    !isVersioned(node.path) &&
    !!(node.frontmatter.sidebar_title || node.frontmatter.title)
  );
}

// Mirrors sortBySidebarOrder from src/docTree.ts (not exported).
function sortBySidebarOrder(a: DocNode, b: DocNode): number {
  const orderDiff =
    (a.frontmatter.sidebar_order ?? 10) - (b.frontmatter.sidebar_order ?? 10);
  if (orderDiff !== 0) {
    return orderDiff;
  }
  const titleA = a.frontmatter.sidebar_title || a.frontmatter.title || '';
  const titleB = b.frontmatter.sidebar_title || b.frontmatter.title || '';
  return titleA.localeCompare(titleB);
}

function getTitle(node: DocNode): string {
  return node.frontmatter.sidebar_title || node.frontmatter.title || node.slug;
}

function formatEntry(node: DocNode, indent = ''): string {
  const title = getTitle(node);
  const url = `${BASE_URL}/${node.path}.md`;
  const desc = node.frontmatter.description;
  return desc ? `${indent}- [${title}](${url}): ${desc}` : `${indent}- [${title}](${url})`;
}

function getGuidesForPlatform(platformNode: DocNode): DocNode[] {
  const guidesNode = platformNode.children.find(c => c.slug === 'guides');
  if (!guidesNode) {
    return [];
  }
  return guidesNode.children.filter(isVisible).sort(sortBySidebarOrder);
}

function generateLlmsTxt(rootNode: DocNode): string {
  const lines: string[] = [];

  lines.push(`# ${SITE_TITLE}`);
  lines.push('');
  lines.push(`> ${SITE_DESCRIPTION}`);
  lines.push('');

  const topLevelSections = rootNode.children
    .filter(node => isVisible(node) && !EXCLUDED_SLUGS.has(node.slug))
    .sort(sortBySidebarOrder);

  for (const section of topLevelSections) {
    lines.push(`## ${getTitle(section)}`);
    lines.push('');

    // Depth: top-level sections (H2) -> their immediate children (2 levels).
    // Platforms go one deeper to include framework guides (3 levels).
    // Going deeper than 2 levels (3 for platform guides) roughly quadruples the file size to ~100KB.
    const children = section.children.filter(isVisible).sort(sortBySidebarOrder);
    if (children.length > 0) {
      for (const child of children) {
        lines.push(formatEntry(child));
        if (section.slug === 'platforms') {
          for (const guide of getGuidesForPlatform(child)) {
            lines.push(formatEntry(guide, '  '));
          }
        }
      }
    } else {
      lines.push(formatEntry(section));
    }

    lines.push('');
  }

  lines.push('## Changelog');
  lines.push('');
  lines.push('- [Sentry Changelog](https://sentry.io/changelog/): Product updates, SDK changes, and new features');
  lines.push('');

  return lines.join('\n');
}

export const GET = async () => {
  const rootNode = await getDocsRootNode();
  const body = generateLlmsTxt(rootNode);

  return new Response(body, {
    headers: {'content-type': 'text/plain; charset=utf-8'},
  });
};
