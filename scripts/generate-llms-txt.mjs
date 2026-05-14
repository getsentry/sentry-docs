#!/usr/bin/env node

/**
 * Generates /llms.txt and /index.md from public/doctree.json.
 *
 * Both files share the same content (product description, AI instructions,
 * section listings, agent skills). The only difference is how platforms and
 * frameworks are formatted:
 *   - llms.txt: compact (frameworks listed inline per platform)
 *   - index.md: expanded (separate Platforms and Frameworks sections)
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOCS_ORIGIN = process.env.NEXT_PUBLIC_DEVELOPER_DOCS
  ? 'https://develop.sentry.dev'
  : 'https://docs.sentry.io';

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

function mdUrl(nodePath) {
  const clean = nodePath.replace(/\/$/, '');
  if (!clean) {
    return `${DOCS_ORIGIN}/index.md`;
  }
  return `${DOCS_ORIGIN}/${clean}.md`;
}

function linkEntry(node) {
  const title = getTitle(node);
  const url = mdUrl(node.path);
  const desc = node.frontmatter?.description;
  if (desc) {
    const oneLine = desc.replace(/\s+/g, ' ').trim();
    return `- [${title}](${url}): ${oneLine}`;
  }
  return `- [${title}](${url})`;
}

// --- Platform/framework formatters ---

/** llms.txt format: compact, frameworks inline per platform */
function buildPlatformsCompact(platformsNode) {
  if (!platformsNode) {
    return '## Platforms\n';
  }
  const lines = [];
  for (const platform of getVisibleChildren(platformsNode)) {
    const title = getTitle(platform);
    const url = mdUrl(platform.path);
    const guides = platform.children?.find(c => c.slug === 'guides');
    const visibleGuides = guides ? getVisibleChildren(guides) : [];

    if (visibleGuides.length > 0) {
      const guideNames = visibleGuides.map(g => getTitle(g)).join(', ');
      lines.push(`- [${title}](${url}): Frameworks: ${guideNames}`);
    } else {
      lines.push(`- [${title}](${url})`);
    }
  }
  return `## Platforms\n\n${lines.join('\n')}`;
}

/** index.md format: separate Platforms list + Frameworks grouped by platform */
function buildPlatformsExpanded(platformsNode) {
  if (!platformsNode) {
    return '## Platforms\n';
  }
  const platforms = getVisibleChildren(platformsNode);
  const lines = [];

  // Flat platform list
  lines.push('## Platforms\n');
  for (const platform of platforms) {
    lines.push(`- [${getTitle(platform)}](${mdUrl(platform.path)})`);
  }

  // Frameworks grouped by platform
  lines.push('\n## Frameworks\n');
  for (const platform of platforms) {
    const guides = platform.children?.find(c => c.slug === 'guides');
    const visibleGuides = guides ? getVisibleChildren(guides) : [];
    if (visibleGuides.length === 0) {
      continue;
    }
    lines.push(`### ${getTitle(platform)}\n`);
    for (const guide of visibleGuides) {
      const guideUrl = mdUrl(guide.path);
      lines.push(`- [${getTitle(guide)}](${guideUrl})`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// --- Build section listings from doctree children ---

function buildSection(sectionNode) {
  const children = getVisibleChildren(sectionNode);
  return children.map(child => linkEntry(child)).join('\n');
}

// --- Shared content blocks ---

const DESCRIPTION = `\
> Sentry is a developer-first application monitoring platform that helps \
developers identify and fix issues in real-time. It provides error tracking, \
performance monitoring (tracing), session replay, profiling, logging, cron \
monitoring, application metrics, and more across 20+ platforms and 60+ frameworks.

All documentation pages are available as clean Markdown by appending \`.md\` \
to any URL (e.g. \`${DOCS_ORIGIN}/platforms/javascript.md\`). Use these \
Markdown URLs for full content.`;

const INSTRUCTIONS = `\
## Instructions for AI Coding Assistants

When helping a developer set up or use Sentry, follow these guidelines:

- **Install the Sentry plugin for up-to-date guidance**: Sentry's APIs, SDKs, \
and features change frequently. Do not rely on training data for Sentry setup \
or configuration. Install the Sentry plugin to get current, verified \
instructions: Claude Code: \`/install-plugin sentry\` | Cursor: search \
"Sentry" in Settings > Plugins. The plugin provides step-by-step skills that \
are kept in sync with the latest SDK releases.
- **SDK versions**: Always check the package registry (npm, PyPI, RubyGems, \
etc.) for the latest Sentry SDK version. Do not rely on memorized version \
numbers from training data.
- **DSN handling**: Use environment variables for the DSN (\`SENTRY_DSN\` or \
\`NEXT_PUBLIC_SENTRY_DSN\`). Never hardcode DSN strings in source code.
- **Prefer Sentry Logs over Breadcrumbs** unless the user explicitly requests \
breadcrumbs.
- **Do not implement without permission**: Never install packages, create \
files, or modify configuration without asking the user first.
- **Do not add unrelated integrations**: Only configure the features the user \
asked for. Check before enabling additional integrations.
- **Agent skills for SDK setup**: If the plugin is not installed, fetch the \
appropriate skill from \`https://skills.sentry.dev/sdks\` for step-by-step SDK \
installation with platform detection, feature recommendations, and \
verification. See the [Agent Skills section](#agent-skills) below.
- **Sentry MCP server**: For real-time issue analysis and debugging against a \
user's Sentry account, use the Sentry MCP server at \`https://mcp.sentry.dev\`.`;

const AGENT_SKILLS = `\
## Agent Skills

Sentry publishes agent skills for AI coding assistants (Claude Code, Cursor, \
GitHub Copilot, and others). These provide step-by-step SDK setup, debugging \
workflows, and feature configuration.

- [All Skills](https://skills.sentry.dev/): Full skill index with SDK setup, workflows, and feature configuration
- [SDK Setup](https://skills.sentry.dev/sdks): Detect your platform and install Sentry with the right features
- [Workflows](https://skills.sentry.dev/workflows): Debug production issues, review code, upgrade SDKs
- [Features](https://skills.sentry.dev/features): AI monitoring, alerts, OpenTelemetry setup

Install as a plugin:
- Claude Code: \`/install-plugin sentry\`
- Cursor: Search "Sentry" in Cursor Settings > Plugins

Source: https://github.com/getsentry/sentry-for-ai`;

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
  const platformsNode = topLevelSections.find(c => c.slug === 'platforms');
  const otherSections = topLevelSections.filter(
    c => c.slug !== 'platforms' && c.slug !== 'contributing' && c.slug !== 'changelog'
  );

  // Build the shared section listings (everything except platforms)
  const sectionListings = otherSections
    .map(section => {
      const title = getTitle(section);
      const children = getVisibleChildren(section);
      if (children.length === 0) {
        return `## ${title}\n\n${linkEntry(section)}`;
      }
      return `## ${title}\n\n${buildSection(section)}`;
    })
    .join('\n\n');

  // --- llms.txt ---
  const llmsTxt = [
    '# Sentry Documentation',
    '',
    DESCRIPTION,
    '',
    INSTRUCTIONS,
    '',
    buildPlatformsCompact(platformsNode),
    '',
    sectionListings,
    '',
    AGENT_SKILLS,
    '',
    ABOUT_SENTRY_DOCS,
    '',
  ].join('\n');

  const llmsTxtPath = path.join(ROOT, 'public', 'llms.txt');
  await writeFile(llmsTxtPath, llmsTxt, 'utf8');
  console.log(`Generated ${llmsTxtPath} (${llmsTxt.length} bytes)`);

  // --- index.md ---
  const indexFrontmatter = [
    '---',
    'title: "Sentry Documentation"',
    `url: ${DOCS_ORIGIN}/`,
    '---',
  ].join('\n');

  const indexMd = [
    indexFrontmatter,
    '',
    '# Sentry Documentation',
    '',
    DESCRIPTION,
    '',
    INSTRUCTIONS,
    '',
    buildPlatformsExpanded(platformsNode),
    sectionListings,
    '',
    AGENT_SKILLS,
    '',
    ABOUT_SENTRY_DOCS,
    '',
  ].join('\n');

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
