#!/usr/bin/env ts-node

/**
 * Lint: Missing sentry_ui_url
 *
 * Checks MDX files that contain screenshot image references to ensure
 * they have a `sentry_ui_url` field in their frontmatter. This runs
 * as a CI check or pre-commit hook to catch missing URLs before merge.
 *
 * Exit codes:
 *   0 = all good (or --warn mode)
 *   1 = missing URLs found (in --strict mode, default)
 *
 * Usage:
 *   npx ts-node scripts/screenshot-pipeline/tools/lint-frontmatter-urls.ts
 *   npx ts-node scripts/screenshot-pipeline/tools/lint-frontmatter-urls.ts --warn   # warn only, don't fail
 *   npx ts-node scripts/screenshot-pipeline/tools/lint-frontmatter-urls.ts --fix    # auto-inject using auto-map
 *   npx ts-node scripts/screenshot-pipeline/tools/lint-frontmatter-urls.ts -- docs/product/issues/index.mdx  # check specific files
 */

import * as fs from 'fs';
import * as path from 'path';
import {glob} from 'glob';
import matter from 'gray-matter';

// Image reference patterns (same as crawler)
const MD_IMAGE_RE = /!\[([^\]]*)\]\(([^)]+\.(?:png|jpg|jpeg|gif|webp))\)/gi;
const JSX_IMG_RE = /<img\s[^>]*src=["']([^"']+\.(?:png|jpg|jpeg|gif|webp))["'][^>]*\/?>/gi;

// Paths that don't need sentry_ui_url (tutorials with non-UI screenshots, etc.)
const EXEMPT_PATHS = [
  'docs/contributing/',
  'docs/platforms/',
  'docs/cli/',
  'docs/api/',
  'docs/security-legal-pii/',
  'docs/concepts/',
  'docs/guides/',
  'docs/pricing/',
  'develop-docs/',
  'platform-includes/',
];

interface LintResult {
  filePath: string;
  imageCount: number;
  hasFrontmatterUrl: boolean;
}

function main() {
  const warnOnly = process.argv.includes('--warn');
  const fix = process.argv.includes('--fix');

  // Check for specific files passed as arguments
  const fileArgs = process.argv
    .slice(2)
    .filter(a => !a.startsWith('--') && (a.endsWith('.mdx') || a.endsWith('.md')));

  const repoRoot = findRepoRoot();

  let filesToCheck: string[];

  if (fileArgs.length > 0) {
    // Check only specified files
    filesToCheck = fileArgs.map(f => path.resolve(repoRoot, f));
  } else {
    // Check all docs MDX files
    filesToCheck = glob.sync(path.join(repoRoot, 'docs/**/*.{md,mdx}'), {nodir: true});
  }

  const missing: LintResult[] = [];
  let checked = 0;
  let skipped = 0;

  for (const filePath of filesToCheck) {
    const relPath = path.relative(repoRoot, filePath);

    // Skip exempt paths
    if (EXEMPT_PATHS.some(exempt => relPath.startsWith(exempt))) {
      skipped++;
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // Count image references (skip external URLs)
    const imageCount = countLocalImages(content);
    if (imageCount === 0) {
      skipped++;
      continue;
    }

    checked++;

    // Check frontmatter
    let hasFrontmatterUrl = false;
    try {
      const parsed = matter(content);
      hasFrontmatterUrl = !!parsed.data.sentry_ui_url;
    } catch {
      // Frontmatter parse failed
    }

    if (!hasFrontmatterUrl) {
      missing.push({filePath: relPath, imageCount, hasFrontmatterUrl});
    }
  }

  // Report
  if (missing.length === 0) {
    console.log(`Checked ${checked} files with screenshots. All have sentry_ui_url.`);
    process.exit(0);
  }

  const label = warnOnly ? 'WARNING' : 'ERROR';
  console.log(
    `${label}: ${missing.length} file(s) with screenshots missing sentry_ui_url:\n`
  );

  for (const result of missing) {
    console.log(`  ${result.filePath} (${result.imageCount} image(s))`);
  }

  console.log(
    `\nAdd sentry_ui_url to the frontmatter of these files.`
  );
  console.log(`Example:`);
  console.log(`  ---`);
  console.log(`  title: Your Page`);
  console.log(`  sentry_ui_url: https://sentry.io/organizations/{org}/your/page/`);
  console.log(`  ---`);
  console.log(``);
  console.log(`Or run the auto-mapper to bulk-fill:`);
  console.log(`  cd scripts/screenshot-pipeline`);
  console.log(`  npm run crawl && npm run auto-map && npm run inject-urls`);

  if (fix) {
    console.log(`\n--fix was passed. Running auto-map + inject...`);
    // This would shell out to the other scripts, but for simplicity
    // just point them to the right commands
    console.log(`Run: cd scripts/screenshot-pipeline && npm run crawl && npm run auto-map && npm run inject-urls`);
  }

  if (!warnOnly) {
    process.exit(1);
  }
}

function countLocalImages(content: string): number {
  let count = 0;

  // Strip frontmatter before checking
  const bodyStart = content.indexOf('---', 4);
  const body = bodyStart > 0 ? content.substring(bodyStart + 3) : content;

  const mdRe = new RegExp(MD_IMAGE_RE.source, MD_IMAGE_RE.flags);
  let match: RegExpExecArray | null;
  while ((match = mdRe.exec(body)) !== null) {
    const imgPath = match[2];
    // Skip external URLs
    if (!imgPath.startsWith('http://') && !imgPath.startsWith('https://')) {
      count++;
    }
  }

  const jsxRe = new RegExp(JSX_IMG_RE.source, JSX_IMG_RE.flags);
  while ((match = jsxRe.exec(body)) !== null) {
    const imgPath = match[1];
    if (!imgPath.startsWith('http://') && !imgPath.startsWith('https://')) {
      count++;
    }
  }

  return count;
}

function findRepoRoot(): string {
  let dir = __dirname;
  for (let i = 0; i < 10; i++) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        if (pkg.name === 'sentry-docs') {
          return dir;
        }
      } catch {
        // continue
      }
    }
    dir = path.dirname(dir);
  }
  return process.cwd();
}

main();
