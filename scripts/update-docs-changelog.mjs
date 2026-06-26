#!/usr/bin/env node

/**
 * Fetches recent merged PRs from sentry-docs and generates a CHANGELOG.md file.
 * This script is run by GitHub Actions on a schedule.
 *
 * Usage: node scripts/update-docs-changelog.mjs
 *
 * Requires GITHUB_TOKEN environment variable for API access.
 */

import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT_DIR, 'includes', 'docs-changelog.mdx');

// Cache for page titles extracted from frontmatter
const pageTitleCache = new Map();

/**
 * Extract the title from a doc file's frontmatter.
 * Returns the title or null if not found.
 */
function getPageTitle(filePath) {
  // Only process docs and develop-docs MDX files
  const isDocsFile = filePath.startsWith('docs/') && filePath.match(/\.mdx?$/);
  const isDevelopDocsFile =
    filePath.startsWith('develop-docs/') && filePath.match(/\.mdx?$/);

  if (!isDocsFile && !isDevelopDocsFile) {
    return null;
  }

  // Check cache first
  if (pageTitleCache.has(filePath)) {
    return pageTitleCache.get(filePath);
  }

  const fullPath = path.join(ROOT_DIR, filePath);

  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    pageTitleCache.set(filePath, null);
    return null;
  }

  try {
    const content = fs.readFileSync(fullPath, 'utf-8');

    // Extract frontmatter (between --- markers)
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      pageTitleCache.set(filePath, null);
      return null;
    }

    // Extract title from frontmatter
    const titleMatch = frontmatterMatch[1].match(/^title:\s*["']?(.+?)["']?\s*$/m);
    if (titleMatch) {
      const title = titleMatch[1].trim();
      pageTitleCache.set(filePath, title);
      return title;
    }
  } catch (error) {
    console.warn(`  Could not read title from ${filePath}: ${error.message}`);
  }

  pageTitleCache.set(filePath, null);
  return null;
}

/**
 * Get the first supported guide from a file's frontmatter.
 * Returns the guide name (e.g., 'bun' from 'javascript.bun') or null.
 */
function getFirstSupportedGuide(filePath) {
  const fullPath = path.join(ROOT_DIR, filePath);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      return null;
    }

    // Look for supported: array in frontmatter
    const supportedMatch = frontmatterMatch[1].match(
      /supported:\s*\n((?:\s+-\s+.+\n?)+)/
    );
    if (supportedMatch) {
      // Get first supported platform (e.g., "  - javascript.bun")
      const firstSupported = supportedMatch[1].match(/^\s+-\s+(.+)/m);
      if (firstSupported) {
        // Extract guide from platform string (e.g., 'bun' from 'javascript.bun')
        const parts = firstSupported[1].trim().split('.');
        if (parts.length >= 2) {
          return parts[1]; // Return the guide name
        }
      }
    }
  } catch (error) {
    // Ignore errors
  }

  return null;
}

/**
 * Convert a file path to a URL path for docs.
 * Handles:
 * - docs/ files - docs.sentry.io URLs
 * - Platform files with /common/ - uses first supported guide from frontmatter
 * - develop-docs/ files - develop.sentry.dev URLs (external)
 */
function fileToUrl(filePath) {
  if (!filePath.match(/\.mdx?$/)) {
    return null;
  }

  // Handle develop-docs files (served at develop.sentry.dev)
  if (filePath.startsWith('develop-docs/')) {
    let url = filePath.replace(/^develop-docs\//, '/').replace(/\.mdx?$/, '/');
    url = url.replace(/\/index\/$/, '/');
    return `https://develop.sentry.dev${url}`;
  }

  // Handle docs files
  if (!filePath.startsWith('docs/')) {
    return null;
  }

  let url = filePath.replace(/^docs\//, '/').replace(/\.mdx?$/, '/');

  // Handle /common/ paths
  if (filePath.includes('/common/')) {
    // First, check if the file specifies a supported guide in frontmatter
    const guide = getFirstSupportedGuide(filePath);
    if (guide) {
      // File specifies a guide - use /guides/<guide>/ path
      url = url.replace('/common/', `/guides/${guide}/`);
    } else {
      // No specific guide - just remove /common/ (works for most platforms)
      url = url.replace('/common/', '/');
    }
  }

  url = url.replace(/\/index\/$/, '/');
  return url;
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'getsentry';
const REPO_NAME = 'sentry-docs';

// Number of PRs to fetch
const PR_LIMIT = 50;

// PRs to exclude (bot PRs, CI updates, etc.)
const EXCLUDED_AUTHORS = ['github-actions[bot]', 'dependabot[bot]', 'getsentry-bot'];
const EXCLUDED_TITLE_PATTERNS = [
  /^Bump API schema/i,
  /^chore\(deps\)/i,
  /^\[automated\]/i,
  /^chore: Update docs changelog/i,
];

async function fetchMergedPRs() {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'sentry-docs-changelog',
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }

  // Fetch recently merged PRs
  const searchQuery = `repo:${REPO_OWNER}/${REPO_NAME} is:pr is:merged sort:updated-desc`;
  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(searchQuery)}&per_page=${PR_LIMIT}`;

  console.log('Fetching merged PRs...');

  const response = await fetch(url, {headers});

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`Found ${data.items.length} merged PRs`);

  return data.items;
}

async function fetchPRDetails(prNumber) {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'sentry-docs-changelog',
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls/${prNumber}`;
  const response = await fetch(url, {headers});

  if (!response.ok) {
    console.warn(`Failed to fetch PR #${prNumber}: ${response.status}`);
    return null;
  }

  return response.json();
}

async function fetchPRFiles(prNumber) {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'sentry-docs-changelog',
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls/${prNumber}/files?per_page=100`;
  const response = await fetch(url, {headers});

  if (!response.ok) {
    console.warn(`Failed to fetch files for PR #${prNumber}: ${response.status}`);
    return {files: [], truncated: false};
  }

  const files = await response.json();

  // Check if there are more pages (GitHub returns Link header for pagination)
  // If we got exactly 100 files, there may be more - mark as truncated
  const truncated = files.length >= 100;

  return {files, truncated};
}

function shouldIncludePR(pr) {
  // Exclude bot authors
  if (EXCLUDED_AUTHORS.includes(pr.user?.login)) {
    return false;
  }

  // Exclude PRs matching excluded title patterns
  for (const pattern of EXCLUDED_TITLE_PATTERNS) {
    if (pattern.test(pr.title)) {
      return false;
    }
  }

  return true;
}

function categorizeFiles(files) {
  const added = [];
  const modified = [];
  const removed = [];

  for (const file of files) {
    // Only include MDX doc files from docs/ or develop-docs/
    const isDocsFile =
      file.filename.startsWith('docs/') && file.filename.match(/\.mdx?$/);
    const isDevelopDocsFile =
      file.filename.startsWith('develop-docs/') && file.filename.match(/\.mdx?$/);

    if (!isDocsFile && !isDevelopDocsFile) {
      continue;
    }

    // For non-removed files, only include if the file exists locally
    // This avoids linking to pages that haven't been deployed yet
    if (file.status !== 'removed') {
      const fullPath = path.join(ROOT_DIR, file.filename);
      if (!fs.existsSync(fullPath)) {
        continue;
      }
    }

    const fileInfo = {
      path: file.filename,
      title: getPageTitle(file.filename),
      url: fileToUrl(file.filename),
    };

    if (file.status === 'added') {
      added.push(fileInfo);
    } else if (file.status === 'removed') {
      removed.push(fileInfo);
    } else {
      modified.push(fileInfo);
    }
  }

  return {added, modified, removed};
}

/**
 * Format a file entry as a markdown list item with link
 */
function formatFileLink(file) {
  if (file.url && file.title) {
    return `[${file.title}](${file.url})`;
  } else if (file.url) {
    // Use URL path as title if no title found
    return `[${file.url}](${file.url})`;
  } else if (file.title) {
    return file.title;
  }
  // Fallback to filename
  return file.path.replace(/^docs\//, '').replace(/\.mdx?$/, '');
}

/**
 * Generate markdown for a single PR entry
 */
function generatePRMarkdown(entry) {
  const lines = [];

  // PR title with link
  lines.push(`### [${entry.title}](${entry.url})`);
  lines.push('');

  // Files changed
  const {added, modified, removed} = entry.filesChanged;

  if (added.length > 0) {
    lines.push('**Added:**');
    for (const file of added) {
      lines.push(`- ${formatFileLink(file)}`);
    }
    lines.push('');
  }

  if (modified.length > 0) {
    lines.push('**Modified:**');
    for (const file of modified) {
      lines.push(`- ${formatFileLink(file)}`);
    }
    lines.push('');
  }

  if (removed.length > 0) {
    lines.push('**Removed:**');
    for (const file of removed) {
      lines.push(`- ${formatFileLink(file)}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Generate the full changelog markdown
 */
function generateChangelog(entries) {
  const lines = [];

  // Group entries by date
  const entriesByDate = new Map();
  for (const entry of entries) {
    const date = new Date(entry.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!entriesByDate.has(date)) {
      entriesByDate.set(date, []);
    }
    entriesByDate.get(date).push(entry);
  }

  // Generate markdown for each date
  for (const [date, dateEntries] of entriesByDate) {
    lines.push(`## ${date}`);
    lines.push('');

    for (const entry of dateEntries) {
      lines.push(generatePRMarkdown(entry));
      lines.push('---');
      lines.push('');
    }
  }

  return lines.join('\n');
}

async function main() {
  console.log('Starting docs changelog update...');

  if (!GITHUB_TOKEN) {
    console.warn('Warning: GITHUB_TOKEN not set. API rate limits will be restrictive.');
  }

  try {
    const prs = await fetchMergedPRs();
    const entries = [];

    for (const pr of prs) {
      if (!shouldIncludePR(pr)) {
        console.log(`Skipping PR #${pr.number}: ${pr.title}`);
        continue;
      }

      console.log(`Processing PR #${pr.number}: ${pr.title}`);

      // Fetch additional PR details
      const prDetails = await fetchPRDetails(pr.number);
      if (!prDetails) continue;

      // Fetch files changed
      const {files: prFiles, truncated} = await fetchPRFiles(pr.number);

      // Skip PRs with 100+ files to avoid incomplete data
      // (we fetch 50 PRs but only need 20 entries, so we have buffer)
      if (truncated) {
        console.log(`  Skipping - PR has 100+ files, likely a large refactor`);
        continue;
      }

      const filesChanged = categorizeFiles(prFiles);

      // Skip PRs with no doc file changes
      const totalDocFiles =
        filesChanged.added.length +
        filesChanged.modified.length +
        filesChanged.removed.length;
      if (totalDocFiles === 0) {
        console.log(`  Skipping - no documentation files changed`);
        continue;
      }

      const entry = {
        title: String(pr.title || ''),
        url: String(pr.html_url || ''),
        publishedAt: String(prDetails.merged_at || pr.closed_at || pr.updated_at || ''),
        author: String(pr.user?.login || 'unknown'),
        filesChanged,
      };

      entries.push(entry);
      console.log(`  Added: ${entry.title} (${totalDocFiles} doc files)`);

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Sort by date, most recent first
    entries.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    // Limit to 20 most recent
    const recentEntries = entries.slice(0, 20);

    // Generate markdown
    const markdown = generateChangelog(recentEntries);

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, markdown);
    console.log(`\nWrote ${recentEntries.length} entries to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Error updating changelog:', error);
    process.exit(1);
  }
}

main();
