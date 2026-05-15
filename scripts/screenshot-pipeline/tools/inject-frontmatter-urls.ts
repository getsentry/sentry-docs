#!/usr/bin/env ts-node

/**
 * Inject Frontmatter URLs
 *
 * Reads the auto-mapper output and injects `sentry_ui_url` into the
 * frontmatter of each MDX file that contains stale screenshots.
 *
 * This makes the URL mapping self-describing -- it moves with the file
 * when docs are reorganized, eliminating the need for a separate mapping table.
 *
 * Usage:
 *   npx ts-node scripts/screenshot-pipeline/tools/inject-frontmatter-urls.ts
 *   npx ts-node scripts/screenshot-pipeline/tools/inject-frontmatter-urls.ts --dry-run
 *   npx ts-node scripts/screenshot-pipeline/tools/inject-frontmatter-urls.ts --scope docs/product/issues
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import matter from 'gray-matter';
import {AssetInventoryItem} from '../src/lib/types';

interface AutoMapEntry {
  asset_path: string;
  ui_page_url: string;
  deterministic: boolean;
}

function main() {
  const repoRoot = findRepoRoot();
  const dryRun = process.argv.includes('--dry-run');
  const scope = getCliArg('--scope');

  console.log('=== Inject Frontmatter URLs ===');
  console.log(`Dry run: ${dryRun}`);
  if (scope) console.log(`Scope: ${scope}`);
  console.log('');

  // Load inventory manifest to get doc_path -> asset_path mapping
  const manifestPath = path.join(
    repoRoot,
    'scripts/screenshot-pipeline/output/inventory-manifest.json'
  );
  if (!fs.existsSync(manifestPath)) {
    console.error('Error: Run the inventory crawler first: npm run crawl');
    process.exit(1);
  }
  const inventory: AssetInventoryItem[] = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  // Load auto-mapper output
  const autoMapPath = path.join(
    repoRoot,
    'scripts/screenshot-pipeline/output/screenshot-map-auto.yaml'
  );
  if (!fs.existsSync(autoMapPath)) {
    console.error('Error: Run the auto-mapper first: npm run auto-map');
    process.exit(1);
  }

  // Parse the auto-map YAML (it has comments we need to strip for yaml.load)
  const autoMapRaw = fs.readFileSync(autoMapPath, 'utf-8');
  const autoMapEntries = parseAutoMapYaml(autoMapRaw);

  console.log(`Loaded ${autoMapEntries.length} auto-mapped entries\n`);

  // Build a lookup: asset_path -> { url, deterministic }
  const urlByAsset = new Map<string, {url: string; deterministic: boolean}>();
  for (const entry of autoMapEntries) {
    if (entry.ui_page_url) {
      urlByAsset.set(entry.asset_path, {
        url: entry.ui_page_url,
        deterministic: entry.deterministic,
      });
    }
  }

  // Build a lookup: doc_path -> best URL for that doc
  // A doc might have multiple images; we pick the URL from the first stale one
  const urlByDoc = new Map<string, {url: string; deterministic: boolean}>();
  const staleItems = inventory.filter(
    i => i.is_stale && i.asset_type === 'standard_screenshot'
  );

  for (const item of staleItems) {
    if (urlByDoc.has(item.doc_path)) continue; // already mapped
    const mapping = urlByAsset.get(item.asset_path);
    if (mapping) {
      urlByDoc.set(item.doc_path, mapping);
    }
  }

  // Also map docs that have non-stale screenshots if they share a URL
  // (captures the full set of docs with screenshots)
  for (const item of inventory) {
    if (item.asset_type !== 'standard_screenshot') continue;
    if (urlByDoc.has(item.doc_path)) continue;
    const mapping = urlByAsset.get(item.asset_path);
    if (mapping) {
      urlByDoc.set(item.doc_path, mapping);
    }
  }

  console.log(`Docs to update: ${urlByDoc.size}\n`);

  // Inject frontmatter
  let updated = 0;
  let skipped = 0;
  let alreadyHas = 0;

  for (const [docPath, mapping] of urlByDoc.entries()) {
    if (scope && !docPath.startsWith(scope)) {
      continue;
    }

    const fullPath = path.join(repoRoot, docPath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`  Warning: File not found: ${docPath}`);
      skipped++;
      continue;
    }

    const raw = fs.readFileSync(fullPath, 'utf-8');
    const parsed = matter(raw);

    // Check if sentry_ui_url already exists
    if (parsed.data.sentry_ui_url) {
      alreadyHas++;
      continue;
    }

    // Add sentry_ui_url to frontmatter
    parsed.data.sentry_ui_url = mapping.url;

    if (dryRun) {
      console.log(`  [DRY RUN] ${docPath} <- ${mapping.url}`);
      updated++;
      continue;
    }

    // Rebuild the file with updated frontmatter
    // We manually reconstruct to preserve formatting as much as possible
    const newContent = injectFrontmatterField(raw, 'sentry_ui_url', mapping.url);
    fs.writeFileSync(fullPath, newContent);
    console.log(`  Updated: ${docPath} <- ${mapping.url}`);
    updated++;
  }

  console.log(`\n=== Summary ===`);
  console.log(`Updated: ${updated}`);
  console.log(`Already had sentry_ui_url: ${alreadyHas}`);
  console.log(`Skipped (file not found): ${skipped}`);
}

/**
 * Inject a new field into YAML frontmatter while preserving the
 * original formatting. Inserts before the closing --- delimiter.
 */
function injectFrontmatterField(
  content: string,
  field: string,
  value: string
): string {
  // Find the frontmatter boundaries
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return content; // no frontmatter
  }

  const frontmatterBody = frontmatterMatch[1];
  const endIdx = content.indexOf('\n---', 4); // skip the opening ---

  // Check if field already exists
  if (frontmatterBody.includes(`${field}:`)) {
    return content;
  }

  // Insert the new field before the closing ---
  const before = content.substring(0, endIdx);
  const after = content.substring(endIdx);

  return `${before}\n${field}: ${value}${after}`;
}

/**
 * Parse the auto-map YAML file, handling the comment-heavy format.
 * Extracts entries that have a ui_page_url set (non-empty).
 */
function parseAutoMapYaml(raw: string): AutoMapEntry[] {
  // Strip comment-only lines and commented-out entries
  const lines = raw.split('\n').filter(line => {
    const trimmed = line.trimStart();
    // Keep lines that are part of YAML entries (start with - or whitespace)
    // Skip pure comment lines
    if (trimmed.startsWith('#')) return false;
    return true;
  });

  const cleanYaml = lines.join('\n');

  try {
    const entries = yaml.load(cleanYaml) as AutoMapEntry[] | null;
    if (!Array.isArray(entries)) return [];
    return entries.filter(e => e.ui_page_url && e.ui_page_url.trim() !== '');
  } catch (err) {
    console.warn(`Warning: Could not parse auto-map YAML: ${err}`);
    return [];
  }
}

// ── Helpers ──

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

function getCliArg(flag: string): string | null {
  const idx = process.argv.indexOf(flag);
  if (idx >= 0 && idx + 1 < process.argv.length) {
    return process.argv[idx + 1];
  }
  return null;
}

// ── Entry Point ──

main();
