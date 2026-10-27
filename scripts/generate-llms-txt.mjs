#!/usr/bin/env node

/**
 * Generates /llms.txt and /index.md from public/doctree.json.
 *
 * Both files share the same body: product description, AI instructions,
 * platforms and frameworks, and the doc sections listed for agents.
 * index.md adds YAML frontmatter for the Markdown export.
 *
 * Platforms with a guides/ directory list those guides as frameworks.
 * Platforms that document frameworks as integrations (Python, Elixir, and
 * any later platform with the same setup) list web frameworks only.
 *
 * Run after `generate-doctree` (doctree.json must exist).
 * Output:
 *   - public/llms.txt
 *   - public/md-exports/index.md (overwrites md-exports pipeline output)
 *
 * llms.txt follows the llmstxt.org specification.
 * index.md includes YAML frontmatter matching the md-exports convention.
 */

import {existsSync} from 'node:fs';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import * as path from 'node:path';
import {fileURLToPath} from 'node:url';

import {frameworkNodes} from './platform-frameworks.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOCS_ORIGIN = process.env.NEXT_PUBLIC_DEVELOPER_DOCS
  ? 'https://develop.sentry.dev'
  : 'https://docs.sentry.io';

const EXCLUDED_SECTIONS = new Set(['platforms', 'contributing', 'changelog', 'ai']);

// Titles or descriptions that should stay as written for agents, where they
// differ from the page frontmatter.
const LINK_OVERRIDES = {
  pricing: {
    title: 'Pricing',
    description:
      'Plans, free monthly quotas per feature, trial details, and pay-as-you-go pricing for individual SKUs.',
  },
  'pricing/quotas/spike-protection': {
    description:
      "Learn how to manage quota and make sure that volume isn't consumed all at once with Spike Protection.",
  },
  'security-legal-pii/scrubbing/server-side-scrubbing': {
    title: 'Server Side Scrubbing',
  },
};

// Pages nested deeper than the section's first sidebar level.
const EXTRA_PATHS = {
  'security-legal-pii': [
    'security-legal-pii/scrubbing/server-side-scrubbing',
    'security-legal-pii/security/data-retention-periods',
  ],
  concepts: ['concepts/key-terms/sample-rates'],
};

// Replaces the default child listing. Pricing's own page is not a child of itself.
const ORDERED_PATHS = {
  pricing: ['pricing', 'pricing/quotas/spike-protection', 'pricing/quotas'],
};

// --- Doctree helpers (same logic as generate-md-exports.mjs) ---

function getTitle(node) {
  return node.frontmatter?.sidebar_title || node.frontmatter?.title || node.slug;
}

function isVisible(node) {
  return (
    !node.frontmatter?.sidebar_hidden &&
    !node.frontmatter?.draft &&
    !node.path?.includes('__v') &&
    (node.frontmatter?.title || node.frontmatter?.sidebar_title)
  );
}

function getVisibleChildren(node) {
  return (node.children || []).filter(isVisible).sort((a, b) => {
    const orderDiff =
      (a.frontmatter?.sidebar_order ?? 99) - (b.frontmatter?.sidebar_order ?? 99);
    return orderDiff !== 0 ? orderDiff : getTitle(a).localeCompare(getTitle(b));
  });
}

function findNode(root, nodePath) {
  let node = root;
  for (const part of nodePath.split('/').filter(Boolean)) {
    node = (node.children || []).find(child => child.slug === part);
    if (!node) {
      return null;
    }
  }
  return node;
}

function mdUrl(nodePath) {
  const clean = nodePath.replace(/\/$/, '');
  if (!clean) {
    return `${DOCS_ORIGIN}/index.md`;
  }
  return `${DOCS_ORIGIN}/${clean}.md`;
}

function linkEntry(node) {
  const override = LINK_OVERRIDES[node.path] || {};
  const title = override.title || getTitle(node);
  const url = mdUrl(node.path);
  const desc = override.description ?? node.frontmatter?.description;
  if (desc) {
    const oneLine = desc.replace(/\s+/g, ' ').trim();
    return `- [${title}](${url}): ${oneLine}`;
  }
  return `- [${title}](${url})`;
}

function resolvePaths(docTree, nodePaths) {
  const nodes = [];
  for (const nodePath of nodePaths) {
    const node = findNode(docTree, nodePath);
    if (!node) {
      console.warn(`llms.txt: missing doc page ${nodePath}`);
      continue;
    }
    nodes.push(node);
  }
  return nodes;
}

function pagesForSection(section, docTree) {
  const ordered = ORDERED_PATHS[section.slug];
  if (ordered) {
    return resolvePaths(docTree, ordered);
  }
  return [
    ...getVisibleChildren(section),
    ...resolvePaths(docTree, EXTRA_PATHS[section.slug] || []),
  ];
}

function buildSectionListings(sections, docTree) {
  return sections
    .map(section => {
      const pages = pagesForSection(section, docTree);
      const body =
        pages.length > 0
          ? pages.map(page => linkEntry(page)).join('\n')
          : linkEntry(section);
      return `## ${getTitle(section)}\n\n${body}`;
    })
    .join('\n\n');
}

function frameworksFor(platform) {
  return frameworkNodes(platform, {root: ROOT, visibleChildren: getVisibleChildren});
}

/** Separate Platforms list and Frameworks grouped by platform. */
function buildPlatformsExpanded(platformsNode) {
  if (!platformsNode) {
    return '## Platforms';
  }
  const platforms = getVisibleChildren(platformsNode);
  const lines = ['## Platforms', ''];
  for (const platform of platforms) {
    lines.push(`- [${getTitle(platform)}](${mdUrl(platform.path)})`);
  }

  const frameworkBlocks = [];
  for (const platform of platforms) {
    const frameworks = frameworksFor(platform);
    if (frameworks.length === 0) {
      continue;
    }
    const block = [`### ${getTitle(platform)}`, ''];
    for (const framework of frameworks) {
      block.push(`- [${getTitle(framework)}](${mdUrl(framework.path)})`);
    }
    frameworkBlocks.push(block.join('\n'));
  }
  if (frameworkBlocks.length > 0) {
    lines.push('', '## Frameworks', '', frameworkBlocks.join('\n\n'));
  }
  return lines.join('\n');
}

// --- Shared content blocks ---

const SUMMARY =
  'Sentry is an application monitoring platform that helps developers and their agents have the context needed to identify and fix bugs, errors, and performance issues in real-time using a trace-id to create a connected data model across all telemetry.';

const DESCRIPTION = `\
> ${SUMMARY}

Key Sentry capabilities include:

- Error tracking groups errors into issues with a human-readable stack trace and context to help developers find the root cause.
- Distributed tracing for capturing the timing and flow of requests and operations as they happen in an application, across the frontend, backend, or agents (Using Sentry's dedicated agent tracing capabilities). Data types that Sentry collects are connected via a common TraceID, and can be used together for debugging issues. For example, when an error happens, spans, logs, replays, and even profiling data can be used in combination to provide highly useful context for an agent or human to investigate that error.
- Structured logs send text-based log information from frontend or backend applications to help with debugging.
- Session replay allows users to watch video-like reproductions of real user sessions that show a timeline of errors, slow span operations, and other issues.
- Profiling provides precise, function-level visibility into where time is being spent in an application.
- Application metrics take counters, gauges, and distributions from application code to track application health and drill down into related traces, logs, and errors, without cardinality blowing up your bill.
- Seer is Sentry's AI debugging tool that detects and diagnoses errors using Sentry data.

The full list of Sentry features, as well as information on SDKs and pricing, can be found in the Sentry docs (${DOCS_ORIGIN}/index.md). All documentation pages are available as clean Markdown, for example ${DOCS_ORIGIN}/platforms/javascript.md. Use these Markdown URLs for full content.`;

const INSTRUCTIONS = `\
## For AI Agents

When helping a developer set up or use Sentry, follow these guidelines:

- **SDK versions**: Always check the package registry (npm, PyPI, RubyGems, etc.) for the latest Sentry SDK version. Do not rely on memorized version numbers from training data. Get up to date information on SDKs in the docs (${DOCS_ORIGIN}/platforms/)
- **DSN handling**: Use environment variables for the DSN (\`SENTRY_DSN\` or \`NEXT_PUBLIC_SENTRY_DSN\`).
- **Pricing questions**: Don't quote prices or quotas from memory; fetch ${DOCS_ORIGIN}/pricing.md. Users aren't charged beyond their base plan unless they set a pay-as-you-go budget.`;

const ABOUT_SENTRY_DOCS = `\
## About Sentry Docs

- [Documentation Changelog](${DOCS_ORIGIN}/changelog.md): Track recent updates to Sentry docs
- [Contributing to Docs](${DOCS_ORIGIN}/contributing.md): How to contribute to Sentry documentation`;

// --- Main ---

async function main() {
  const doctreeFilename = process.env.NEXT_PUBLIC_DEVELOPER_DOCS
    ? 'doctree-dev.json'
    : 'doctree.json';
  const doctreePath = path.join(ROOT, 'public', doctreeFilename);
  let docTree;
  try {
    docTree = JSON.parse(await readFile(doctreePath, 'utf8'));
  } catch {
    console.error(
      'Error: public/doctree.json not found. Run `pnpm generate-doctree` first.'
    );
    process.exit(1);
  }

  const topLevelSections = getVisibleChildren(docTree);
  const platformsNode = topLevelSections.find(child => child.slug === 'platforms');
  const otherSections = topLevelSections.filter(
    child => !EXCLUDED_SECTIONS.has(child.slug)
  );
  const sectionListings = buildSectionListings(otherSections, docTree);

  const body = [
    '# Sentry',
    '',
    DESCRIPTION,
    '',
    INSTRUCTIONS,
    '',
    buildPlatformsExpanded(platformsNode),
    '',
    sectionListings,
    '',
    ABOUT_SENTRY_DOCS,
    '',
  ].join('\n');

  const llmsTxtPath = path.join(ROOT, 'public', 'llms.txt');
  await writeFile(llmsTxtPath, body, 'utf8');
  console.log(`Generated ${llmsTxtPath} (${body.length} bytes)`);

  const indexFrontmatter = [
    '---',
    `title: ${JSON.stringify('Sentry')}`,
    `description: ${JSON.stringify(SUMMARY)}`,
    `url: ${DOCS_ORIGIN}/`,
    '---',
  ].join('\n');

  const indexMd = `${indexFrontmatter}\n\n${body}`;
  const mdExportsDir = path.join(ROOT, 'public', 'md-exports');
  if (!existsSync(mdExportsDir)) {
    await mkdir(mdExportsDir, {recursive: true});
  }
  const indexMdPath = path.join(mdExportsDir, 'index.md');
  await writeFile(indexMdPath, indexMd, 'utf8');
  console.log(`Generated ${indexMdPath} (${indexMd.length} bytes)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
