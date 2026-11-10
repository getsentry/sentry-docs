#!/usr/bin/env node

/**
 * Generates /llms.txt and /index.md from public/doctree.json.
 *
 * Both files include a product description, AI instructions, a find-and-fix
 * link list, platforms and frameworks, and doc sections. index.md adds YAML
 * frontmatter for the Markdown export and links every framework guide.
 * llms.txt names each platform's frameworks on one line instead, since the
 * platform pages link their guides.
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

import {DOCS_ORIGIN, DOCTREE_FILENAME} from '../src/docsSite.mjs';

import {frameworkNodes} from './platform-frameworks.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const EXCLUDED_SECTIONS = new Set(['platforms', 'contributing', 'changelog', 'ai']);

// Sections in the order an agent needs them: setup and debugging first, account
// administration last. Sections not listed follow in sidebar order.
const SECTION_ORDER = [
  'get-started',
  'product',
  'concepts',
  'integrations',
  'api',
  'cli',
  'organization',
  'account',
  'pricing',
  'security-legal-pii',
];

// API reference pages have no frontmatter description. These summarize each
// category's endpoints so an agent can pick the right one.
const API_DESCRIPTIONS = {
  auth: 'Authenticate API requests with a bearer auth token.',
  permissions:
    'The token scopes each endpoint needs, such as `event:read`, `project:read`, and `org:read` for reading issues.',
  pagination: 'Page through list endpoints with the cursors in the `Link` header.',
  ratelimits: 'Per-caller, per-endpoint rate limits and the headers that report them.',
  requests: 'The `/api/0/` base path, HTTP verbs, and JSON request and response format.',
  events:
    'Find, read, update, and resolve issues, and read their events, tags, hashes, and attachments. Start here to debug an issue.',
  seer: "Start a Seer fix for an issue, read the fix's state, and list Seer's AI models.",
  explore:
    'Query spans, logs, trace metrics, and AI conversations in table or timeseries format.',
  discover:
    'Retrieve a trace and its metadata, list tags and attributes, and manage saved queries.',
  releases: 'Create releases and deploys, and upload artifact bundles and release files.',
  projects:
    'Projects, client keys (DSNs), debug files and symbol sources, ownership and CODEOWNERS, inbound filters, user feedback, and Seer repositories.',
  organizations:
    'Organizations, members, org auth tokens, repositories and commits, and resolving short IDs and event IDs.',
  integrations:
    'Installed integrations, code mappings, source code links for stack trace frames, external users and teams, and data forwarders.',
  integration:
    'Custom integrations built on the Integration Platform and their external issue links.',
  replays:
    'List and read replays, recording segments, and clicked selectors, and delete replays.',
  profiling: 'Retrieve profiles, profile chunks, and flamegraphs.',
  monitors: 'Create, update, and delete monitors and alerts.',
  crons: 'Create, update, and list cron monitors and their check-ins.',
  dashboards: 'Create, edit, list, and restore custom dashboards.',
  environments: "List and update a project's or organization's environments.",
  flags: "Read an organization's feature flag change log.",
  investigations:
    'Private endpoints for investigation notebooks and agent workflows. They need the `organizations:investigations` feature.',
  'mobile-builds':
    'Upload mobile builds, read Size Analysis results, and get installable builds.',
  snapshots: 'Upload snapshot archives and read snapshot details and status checks.',
  'spike-protection': 'Manage Spike Protection notification actions.',
  scim: 'Provision organization members and teams through SCIM.',
  teams: 'Create and delete teams, and manage their members and projects.',
  users: "The current user's details, credentials, and organizations.",
};

// Titles or descriptions that should stay as written for agents, where they
// differ from the page frontmatter.
const LINK_OVERRIDES = {
  ...Object.fromEntries(
    Object.entries(API_DESCRIPTIONS).map(([slug, description]) => [
      `api/${slug}`,
      {description},
    ])
  ),
  'product/mcp-servers': {
    title: 'MCP Server Monitoring',
    description:
      'Trace and debug your own Model Context Protocol server: connections, resource access, and tool executions. To connect an agent to Sentry, use the Sentry MCP server (https://mcp.sentry.dev) instead.',
  },
  // Pages in Find and Fix Issues whose sidebar titles lack context out of place.
  'product/releases/setup': {title: 'Releases Setup'},
  'platforms/javascript/sourcemaps': {title: 'JavaScript Source Maps'},
  'platforms/apple/dsym': {title: 'Apple Debug Symbols (dSYMs)'},
  'platforms/android/enhance-errors/proguard': {title: 'Android ProGuard & DexGuard'},
  'platforms/javascript/troubleshooting': {title: 'JavaScript SDK Troubleshooting'},
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

// Listed first in their section, before the remaining pages in sidebar order.
const PRIORITY_PATHS = {
  product: [
    'product/sentry-basics',
    'product/issues',
    'product/explore',
    'product/errors',
    'product/trace-explorer',
    'product/session-replay',
    'product/logs',
    'product/profiling',
    'product/releases',
    'product/ai-in-sentry',
    'product/monitors-and-alerts',
    'product/monitors-and-alerts/monitors/uptime-monitoring',
    'product/monitors-and-alerts/monitors/crons',
    'product/user-feedback',
  ],
  api: [
    'api/auth',
    'api/permissions',
    'api/events',
    'api/seer',
    'api/explore',
    'api/discover',
    'api/releases',
    'api/projects',
    'api/organizations',
  ],
};

// The pages an agent needs to debug and fix an issue, listed before the
// platforms. Section listings skip these so each link appears once.
const FIND_AND_FIX_PATHS = [
  'product/issues/issue-details',
  'product/issues/grouping-and-fingerprints',
  'product/ai-in-sentry/seer',
  'product/ai-in-sentry/seer/autofix',
  'integrations/coding-agents',
  'product/issues/suspect-commits',
  'product/releases/setup',
  'integrations/source-code-mgmt',
  'platforms/javascript/sourcemaps',
  'platforms/apple/dsym',
  'platforms/android/enhance-errors/proguard',
  'platforms/javascript/troubleshooting',
  'ai/agent-plugin',
];

const AGENT_TOOL_LINKS = `\
- [Sentry CLI (\`sentry\`)](https://cli.sentry.dev): A command-line tool for developers and agents. List and view issues and events, run Seer's analysis and fix plans, and manage projects. It's a different tool from \`sentry-cli\`.
- [Sentry MCP Server](https://mcp.sentry.dev): Connect an AI assistant to Sentry through the Model Context Protocol to search issues, errors, traces, and logs, and to run Seer.`;

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
  const first = resolvePaths(docTree, PRIORITY_PATHS[section.slug] || []);
  const firstPaths = new Set(first.map(node => node.path));
  return [
    ...first,
    ...getVisibleChildren(section).filter(node => !firstPaths.has(node.path)),
    ...resolvePaths(docTree, EXTRA_PATHS[section.slug] || []),
  ];
}

function sortSections(sections) {
  const rank = section => {
    const index = SECTION_ORDER.indexOf(section.slug);
    return index === -1 ? SECTION_ORDER.length : index;
  };
  // Array.prototype.sort is stable, so unlisted sections keep sidebar order.
  return [...sections].sort((a, b) => rank(a) - rank(b));
}

function buildSectionListings(sections, docTree, skipPaths) {
  return sortSections(sections)
    .map(section => {
      const pages = pagesForSection(section, docTree).filter(
        page => !skipPaths.has(page.path)
      );
      const body =
        pages.length > 0
          ? pages.map(page => linkEntry(page)).join('\n')
          : linkEntry(section);
      // The docs' CLI section covers sentry-cli, not the `sentry` CLI at cli.sentry.dev.
      const title = section.slug === 'cli' ? 'sentry-cli' : getTitle(section);
      return `## ${title}\n\n${body}`;
    })
    .join('\n\n');
}

function buildFindAndFix(pages) {
  return [
    '## Find and Fix Issues',
    '',
    AGENT_TOOL_LINKS,
    ...pages.map(page => linkEntry(page)),
  ].join('\n');
}

function frameworksFor(platform) {
  return frameworkNodes(platform, {root: ROOT, visibleChildren: getVisibleChildren});
}

/** One line per platform, naming its frameworks without linking them. */
function buildPlatformsCompact(platformsNode) {
  if (!platformsNode) {
    return '## Platforms';
  }
  const lines = [
    '## Platforms',
    '',
    `Each platform page links its framework guides. Fetch the platform page, then the most specific framework guide. ${DOCS_ORIGIN}/platforms.md lists every guide with its link.`,
    '',
  ];
  for (const platform of getVisibleChildren(platformsNode)) {
    const link = `- [${getTitle(platform)}](${mdUrl(platform.path)})`;
    const frameworks = frameworksFor(platform).map(getTitle);
    lines.push(frameworks.length > 0 ? `${link}: ${frameworks.join(', ')}` : link);
  }
  return lines.join('\n');
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
- Cron and uptime monitoring alert you when a scheduled job misses a run or an endpoint goes down.
- Seer is Sentry's AI debugging agent. It finds the root cause of an issue from its Sentry data and your code, and can generate a fix (${DOCS_ORIGIN}/product/ai-in-sentry/seer.md).

The full list of Sentry features, as well as information on SDKs and pricing, can be found in the Sentry docs (${DOCS_ORIGIN}/index.md). All documentation pages are available as clean Markdown, for example ${DOCS_ORIGIN}/platforms/javascript.md. Use these Markdown URLs for full content.`;

const INSTRUCTIONS = `\
## For AI Agents

When helping a developer set up or use Sentry, follow these guidelines:

- **SDK versions**: Always check the package registry (npm, PyPI, RubyGems, etc.) for the latest Sentry SDK version. Do not rely on memorized version numbers from training data. Get up to date information on SDKs in the docs (${DOCS_ORIGIN}/platforms/)
- **DSN handling**: Read the DSN from an environment variable, such as \`SENTRY_DSN\`. Client-side code needs the framework's public prefix, such as \`NEXT_PUBLIC_SENTRY_DSN\` for Next.js or \`VITE_SENTRY_DSN\` for Vite.
- **Pricing questions**: Don't quote prices or quotas from memory; fetch ${DOCS_ORIGIN}/pricing.md. Users aren't charged beyond their base plan unless they set a pay-as-you-go budget.`;

const SETUP_INSTRUCTIONS = `\
- **Setting up Sentry in a project**: Fetch and follow ${DOCS_ORIGIN}/ai/agent-setup/get-started.md before the platform or framework guide. It covers setup through the Sentry CLI, the Sentry MCP server, or neither, from choosing a project to confirming a real error reaches Sentry.
- **Adding a feature to a project that already uses Sentry**: Fetch and follow ${DOCS_ORIGIN}/ai/agent-setup/instrument.md for tracing, logs, Session Replay, metrics, profiling, crons, uptime, or AI agent monitoring.`;

const DEBUG_INSTRUCTIONS = `\
- **Debugging and fixing an issue**: Read the user's Sentry data through the Sentry CLI (https://cli.sentry.dev) or the Sentry MCP server (https://mcp.sentry.dev). With the CLI, \`sentry issue list\` finds issues, \`sentry issue view\` and \`sentry issue events\` show the stack trace, tags, and breadcrumbs, and \`sentry issue explain\` and \`sentry issue plan\` run Seer's root cause analysis and fix plan. Before you change code, read the latest event and follow its trace ID to the related spans, logs, and replays. After the fix ships, resolve the issue so Sentry reopens it if the error comes back.
- **Tool names**: The \`sentry\` CLI reads and manages Sentry data. \`sentry-cli\`, in the sentry-cli section below, uploads source maps and debug files and manages releases. The MCP Server Monitoring page is for monitoring your own MCP server, not for connecting to Sentry.
- **Readable stack traces**: Production builds minify code or strip symbols, so an error can be unreadable in production even when it looks fine locally. JavaScript needs source maps (${DOCS_ORIGIN}/platforms/javascript/sourcemaps.md, and each framework guide has its own \`sourcemaps\` page). Native and mobile apps need debug files, such as dSYMs for Apple or ProGuard mappings for Android. If a stack trace shows minified names or missing frames, fix the upload before you debug the code.
- **Making issues fixable**: Set the \`release\` and \`environment\` options in production (${DOCS_ORIGIN}/product/releases/setup.md), connect the repository with a source code integration (${DOCS_ORIGIN}/integrations/source-code-mgmt.md), and add code mappings (${DOCS_ORIGIN}/cli/code-mappings.md). Each issue then shows suspect commits and source context, and Seer can read the code.
- **Events not arriving**: Check the platform's troubleshooting page, such as ${DOCS_ORIGIN}/platforms/javascript/troubleshooting.md, before you change the setup.`;

const ABOUT_SENTRY_DOCS = `\
## About Sentry Docs

- [Documentation Changelog](${DOCS_ORIGIN}/changelog.md): Track recent updates to Sentry docs
- [Contributing to Docs](${DOCS_ORIGIN}/contributing.md): How to contribute to Sentry documentation`;

// --- Main ---

async function main() {
  const doctreePath = path.join(ROOT, 'public', DOCTREE_FILENAME);
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
  const findAndFixPages = resolvePaths(docTree, FIND_AND_FIX_PATHS);
  const findAndFixPaths = new Set(findAndFixPages.map(page => page.path));
  const sectionListings = buildSectionListings(otherSections, docTree, findAndFixPaths);

  const buildBody = platforms =>
    [
      '# Sentry',
      '',
      DESCRIPTION,
      '',
      INSTRUCTIONS,
      SETUP_INSTRUCTIONS,
      DEBUG_INSTRUCTIONS,
      '',
      buildFindAndFix(findAndFixPages),
      '',
      platforms,
      '',
      sectionListings,
      '',
      ABOUT_SENTRY_DOCS,
      '',
    ].join('\n');

  const body = buildBody(buildPlatformsCompact(platformsNode));
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

  const indexMd = `${indexFrontmatter}\n\n${buildBody(buildPlatformsExpanded(platformsNode))}`;
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
