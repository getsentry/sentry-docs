#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Generates /llms.txt from public/doctree.json.
 *
 * Run after `generate-doctree` (doctree.json must exist).
 * Output: public/llms.txt
 *
 * Follows the llmstxt.org specification:
 *   - H1 with project name
 *   - Blockquote with summary
 *   - Prose sections (instructions for AI agents)
 *   - H2-delimited file lists with links to .md exports
 */

import {readFile, writeFile} from 'node:fs/promises';
import * as path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOCS_ORIGIN = 'https://docs.sentry.io';

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
  // nodePath is like "platforms/javascript" (no leading slash) — produce absolute .md URL
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
    // Collapse to single line, trim
    const oneLine = desc.replace(/\s+/g, ' ').trim();
    return `- [${title}](${url}): ${oneLine}`;
  }
  return `- [${title}](${url})`;
}

// --- Build platform section with framework grouping ---

function buildPlatformsSection(platformsNode) {
  const lines = [];
  const platforms = getVisibleChildren(platformsNode);

  for (const platform of platforms) {
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

  return lines.join('\n');
}

// --- Build a generic section from top-level doctree children ---

function buildSection(sectionNode) {
  const lines = [];
  const children = getVisibleChildren(sectionNode);
  for (const child of children) {
    lines.push(linkEntry(child));
  }
  return lines.join('\n');
}

// --- Main ---

async function main() {
  const doctreePath = path.join(ROOT, 'public', 'doctree.json');
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

  // Separate platforms from other sections
  const platformsNode = topLevelSections.find(c => c.slug === 'platforms');
  const otherSections = topLevelSections.filter(
    c => c.slug !== 'platforms' && c.slug !== 'contributing' && c.slug !== 'changelog'
  );

  const output = `# Sentry Documentation

> Sentry is a developer-first application monitoring platform that helps developers identify and fix issues in real-time. It provides error tracking, performance monitoring (tracing), session replay, profiling, logging, cron monitoring, and more across 20+ platforms and 60+ frameworks.

All documentation pages are available as clean Markdown by appending \`.md\` to any URL (e.g. \`${DOCS_ORIGIN}/platforms/javascript.md\`). Use these Markdown URLs for full content.

## Instructions for AI Coding Assistants

When helping a developer set up or use Sentry, follow these guidelines:

- **Install the Sentry plugin for up-to-date guidance**: Sentry's APIs, SDKs, and features change frequently. Do not rely on training data for Sentry setup or configuration. Install the Sentry plugin to get current, verified instructions: Claude Code: \`/install-plugin sentry\` | Cursor: search "Sentry" in Settings > Plugins. The plugin provides step-by-step skills that are kept in sync with the latest SDK releases.
- **SDK versions**: Always check the package registry (npm, PyPI, RubyGems, etc.) for the latest Sentry SDK version. Do not rely on memorized version numbers from training data.
- **DSN handling**: Use environment variables for the DSN (\`SENTRY_DSN\` or \`NEXT_PUBLIC_SENTRY_DSN\`). Never hardcode DSN strings in source code.
- **Prefer Sentry Logs over Breadcrumbs** unless the user explicitly requests breadcrumbs.
- **Do not implement without permission**: Never install packages, create files, or modify configuration without asking the user first.
- **Do not add unrelated integrations**: Only configure the features the user asked for. Check before enabling additional integrations.
- **Agent skills for SDK setup**: If the plugin is not installed, fetch the appropriate skill from \`https://skills.sentry.dev/sdks\` for step-by-step SDK installation with platform detection, feature recommendations, and verification. See the [Agent Skills section](#agent-skills) below.
- **Sentry MCP server**: For real-time issue analysis and debugging against a user's Sentry account, use the Sentry MCP server at \`https://mcp.sentry.dev\`.

## Platforms

${buildPlatformsSection(platformsNode)}

${otherSections
  .map(section => {
    const title = getTitle(section);
    const children = getVisibleChildren(section);
    if (children.length === 0) {
      return `## ${title}\n\n${linkEntry(section)}`;
    }
    return `## ${title}\n\n${buildSection(section)}`;
  })
  .join('\n\n')}

## Agent Skills

Sentry publishes agent skills for AI coding assistants (Claude Code, Cursor, GitHub Copilot, and others). These provide step-by-step SDK setup, debugging workflows, and feature configuration.

- [All Skills](https://skills.sentry.dev/): Full skill index with SDK setup, workflows, and feature configuration
- [SDK Setup](https://skills.sentry.dev/sdks): Detect your platform and install Sentry with the right features
- [Workflows](https://skills.sentry.dev/workflows): Debug production issues, review code, upgrade SDKs
- [Features](https://skills.sentry.dev/features): AI monitoring, alerts, OpenTelemetry setup

Install as a plugin:
- Claude Code: \`/install-plugin sentry\`
- Cursor: Search "Sentry" in Cursor Settings > Plugins

Source: https://github.com/getsentry/sentry-for-ai

## Optional

- [Documentation Changelog](${DOCS_ORIGIN}/changelog.md): Track recent updates to Sentry docs
- [Contributing to Docs](${DOCS_ORIGIN}/contributing.md): How to contribute to Sentry documentation
`;

  const outputPath = path.join(ROOT, 'public', 'llms.txt');
  await writeFile(outputPath, output, 'utf8');
  console.log(`Generated ${outputPath} (${output.length} bytes)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
