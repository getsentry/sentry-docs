#!/usr/bin/env ts-node

/**
 * Screenshot Capturer + Differ (Section 2.2 of Tech Spec)
 *
 * For each stale standard_screenshot with a URL mapping, navigates to the
 * Sentry UI page, captures a fresh screenshot, computes a pixel diff, and
 * classifies the result.
 *
 * Usage:
 *   npx ts-node scripts/screenshot-pipeline/src/capture-and-diff.ts
 *   npx ts-node scripts/screenshot-pipeline/src/capture-and-diff.ts --asset docs/product/insights/img/foo.png
 *   npx ts-node scripts/screenshot-pipeline/src/capture-and-diff.ts --doc docs/product/insights/index.mdx
 *   npx ts-node scripts/screenshot-pipeline/src/capture-and-diff.ts --dry-run
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import {
  AssetInventoryItem,
  DiffResult,
  DiffStatus,
  ScreenshotMapEntry,
  loadPipelineConfig,
} from './lib/types';
import {
  createAuthenticatedSession,
  closeSession,
  isAuthRedirect,
  resolveOrgUrl,
  AuthenticatedSession,
} from './lib/auth';
import {computeDiff} from './lib/diff';
import {optimizeImage} from './lib/image-optimizer';

// ── Main ──

async function main() {
  const config = loadPipelineConfig();
  const repoRoot = findRepoRoot();

  // Parse CLI args
  const assetFilter = getCliArg('--asset');
  const docFilter = getCliArg('--doc');
  const dryRun = process.argv.includes('--dry-run') || config.dry_run;

  console.log('=== Screenshot Pipeline: Capturer + Differ ===');
  console.log(`Repo root: ${repoRoot}`);
  console.log(`Dry run: ${dryRun}`);
  console.log(`Diff threshold low: ${(config.diff_threshold_low * 100).toFixed(1)}%`);
  console.log(`Diff threshold high: ${(config.diff_threshold_high * 100).toFixed(1)}%`);
  console.log('');

  // Load inventory manifest
  const manifestPath = path.join(repoRoot, config.output_dir, 'inventory-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error(`Error: Inventory manifest not found at ${manifestPath}`);
    console.error('Run the inventory crawler first: npm run crawl');
    process.exit(1);
  }

  const inventory: AssetInventoryItem[] = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  // Load screenshot map for per-image overrides (element selectors, ignore regions, etc.)
  const screenshotMap = loadScreenshotMap(repoRoot);

  // Filter to capturable items: stale standard screenshots with a URL
  // URL comes from either: frontmatter (in manifest) or screenshot-map.yaml
  let targets = inventory.filter(item => {
    if (item.asset_type !== 'standard_screenshot') return false;
    if (!item.is_stale) return false;

    // Has a URL from frontmatter or screenshot-map.yaml
    const mapEntry = screenshotMap.get(item.asset_path);
    const hasUrl = item.ui_page_url || mapEntry?.ui_page_url;
    if (!hasUrl) return false;

    return true;
  });

  // Apply CLI filters
  if (assetFilter) {
    targets = targets.filter(t => t.asset_path === assetFilter || t.asset_path.includes(assetFilter));
  }
  if (docFilter) {
    targets = targets.filter(t => t.doc_path === docFilter || t.doc_path.includes(docFilter));
  }

  // Build effective map entries: frontmatter URL + screenshot-map.yaml overrides
  const enrichedTargets = targets.map(item => {
    const mapOverride = screenshotMap.get(item.asset_path);
    const effectiveEntry: ScreenshotMapEntry = {
      asset_path: item.asset_path,
      ui_page_url: mapOverride?.ui_page_url || item.ui_page_url || '',
      element_selector: mapOverride?.element_selector || item.element_selector || null,
      viewport: mapOverride?.viewport || {width: 1280, height: 800},
      auth_required: mapOverride?.auth_required ?? true,
      deterministic: mapOverride?.deterministic ?? true,
      wait_for: mapOverride?.wait_for || null,
      ignore_regions: mapOverride?.ignore_regions || [],
    };
    return {item, mapEntry: effectiveEntry};
  });

  console.log(`Found ${enrichedTargets.length} screenshots to capture\n`);

  if (enrichedTargets.length === 0) {
    console.log('No screenshots to capture. Ensure:');
    console.log('  1. Inventory manifest exists (run crawl first)');
    console.log('  2. MDX files have sentry_ui_url in frontmatter, or screenshot-map.yaml has entries');
    console.log('  3. Stale screenshots exist that match the mapping');
    writeEmptyResults(repoRoot, config.output_dir);
    return;
  }

  // Create output directories
  const capturesDir = path.join(repoRoot, config.output_dir, 'captures');
  const diffsDir = path.join(repoRoot, config.output_dir, 'diffs');
  fs.mkdirSync(capturesDir, {recursive: true});
  fs.mkdirSync(diffsDir, {recursive: true});

  // Resolve storage state path relative to repo root
  if (config.storage_state_path && !path.isAbsolute(config.storage_state_path)) {
    config.storage_state_path = path.join(repoRoot, config.storage_state_path);
  }

  // Launch browser
  let session: AuthenticatedSession | null = null;
  if (!dryRun) {
    console.log('Launching browser...');
    session = await createAuthenticatedSession(config);
    console.log('Browser launched\n');
  }

  const results: DiffResult[] = [];

  try {
    for (let i = 0; i < enrichedTargets.length; i++) {
      const {item, mapEntry} = enrichedTargets[i];
      const progress = `[${i + 1}/${enrichedTargets.length}]`;

      console.log(`${progress} Processing: ${item.asset_path}`);

      if (dryRun) {
        console.log(`  [DRY RUN] Would capture: ${mapEntry.ui_page_url}`);
        results.push({
          inventory_item: item,
          capture_path: null,
          diff_pct: null,
          diff_image_path: null,
          status: 'unchanged',
          error: null,
          captured_at: new Date().toISOString(),
        });
        continue;
      }

      const result = await captureAndDiff(
        item,
        mapEntry,
        repoRoot,
        capturesDir,
        diffsDir,
        session!,
        config
      );

      results.push(result);

      console.log(`  Status: ${result.status}`);
      if (result.diff_pct !== null) {
        console.log(`  Diff: ${(result.diff_pct * 100).toFixed(2)}%`);
      }
      if (result.error) {
        console.log(`  Error: ${result.error}`);
      }
      console.log('');
    }
  } finally {
    if (session) {
      await closeSession(session);
      console.log('Browser closed');
    }
  }

  // Write results
  const resultsPath = path.join(repoRoot, config.output_dir, 'diff-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

  // Print summary
  printSummary(results);
  console.log(`\nResults written to: ${resultsPath}`);
}

// ── Capture Logic ──

async function captureAndDiff(
  item: AssetInventoryItem,
  mapEntry: ScreenshotMapEntry,
  repoRoot: string,
  capturesDir: string,
  diffsDir: string,
  session: AuthenticatedSession,
  config: ReturnType<typeof loadPipelineConfig>
): Promise<DiffResult> {
  const capturedAt = new Date().toISOString();

  // Generate file paths
  const safeFileName = item.asset_path.replace(/[/\\]/g, '__');
  const capturePath = path.join(capturesDir, safeFileName);
  const diffImagePath = path.join(diffsDir, `diff__${safeFileName}`);

  try {
    // Resolve the URL
    const url = resolveOrgUrl(mapEntry.ui_page_url, config.sentry_org_slug);

    // Create a new page
    const page = await session.context.newPage();

    try {
      // Navigate -- use 'load' instead of 'networkidle' since Sentry's SPA
      // makes ongoing API calls that prevent networkidle from resolving
      console.log(`  Navigating to: ${url}`);
      await page.goto(url, {
        waitUntil: 'load',
        timeout: config.capture_timeout_ms,
      });

      // Check for auth redirect
      if (isAuthRedirect(page.url())) {
        return {
          inventory_item: item,
          capture_path: null,
          diff_pct: null,
          diff_image_path: null,
          status: 'capture_failed',
          error: `Auth redirect detected: landed on ${page.url()}`,
          captured_at: capturedAt,
        };
      }

      // Wait for optional selector
      if (mapEntry.wait_for) {
        try {
          await page.waitForSelector(mapEntry.wait_for, {
            timeout: config.wait_for_selector_timeout_ms,
          });
        } catch {
          console.warn(`  Warning: wait_for selector "${mapEntry.wait_for}" timed out`);
        }
      }

      // Wait for the page content to settle (SPA rendering + API responses)
      await page.waitForTimeout(5000);

      // Set viewport if specified
      if (mapEntry.viewport) {
        await page.setViewportSize(mapEntry.viewport);
        // Brief wait after viewport change for re-render
        await page.waitForTimeout(500);
      }

      // Capture screenshot
      if (mapEntry.element_selector) {
        // Element screenshot
        const element = await page.$(mapEntry.element_selector);
        if (!element) {
          return {
            inventory_item: item,
            capture_path: null,
            diff_pct: null,
            diff_image_path: null,
            status: 'capture_failed',
            error: `Element not found: ${mapEntry.element_selector}`,
            captured_at: capturedAt,
          };
        }
        await element.screenshot({path: capturePath, type: 'png'});
      } else {
        // Full viewport screenshot
        await page.screenshot({path: capturePath, type: 'png', fullPage: false});
      }

      console.log(`  Captured: ${capturePath}`);

      // Optimize the captured image
      const optimizeResult = await optimizeImage(capturePath, capturePath);
      if (optimizeResult.ratio < 1) {
        const savedPct = ((1 - optimizeResult.ratio) * 100).toFixed(1);
        console.log(`  Optimized: ${savedPct}% size reduction`);
      }
    } finally {
      await page.close();
    }

    // Compute diff against existing image
    const existingImagePath = path.join(repoRoot, item.asset_path);
    if (!fs.existsSync(existingImagePath)) {
      return {
        inventory_item: item,
        capture_path: capturePath,
        diff_pct: 1.0,
        diff_image_path: null,
        status: classifyDiff(1.0, mapEntry.deterministic, config),
        error: `Existing image not found: ${existingImagePath}`,
        captured_at: capturedAt,
      };
    }

    const diffOutput = await computeDiff(existingImagePath, capturePath, diffImagePath, {
      ignoreRegions: mapEntry.ignore_regions || [],
      generateDiffImage: true,
    });

    const status = classifyDiff(diffOutput.diffPct, mapEntry.deterministic, config);

    return {
      inventory_item: item,
      capture_path: capturePath,
      diff_pct: diffOutput.diffPct,
      diff_image_path: diffOutput.diffImagePath,
      status,
      error: null,
      captured_at: capturedAt,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      inventory_item: item,
      capture_path: null,
      diff_pct: null,
      diff_image_path: null,
      status: 'capture_failed',
      error: errorMsg,
      captured_at: capturedAt,
    };
  }
}

// ── Classification ──

function classifyDiff(
  diffPct: number,
  deterministic: boolean,
  config: ReturnType<typeof loadPipelineConfig>
): DiffStatus {
  if (diffPct < config.diff_threshold_low) {
    return 'unchanged';
  }

  if (diffPct >= config.diff_threshold_high) {
    // Suspiciously large change -- even deterministic pages get flagged
    return 'needs_review';
  }

  if (deterministic) {
    return 'auto_replace';
  }

  return 'needs_review';
}

// ── Helpers ──

function loadScreenshotMap(repoRoot: string): Map<string, ScreenshotMapEntry> {
  const mapPath = path.join(
    repoRoot,
    'scripts/screenshot-pipeline/config/screenshot-map.yaml'
  );
  const map = new Map<string, ScreenshotMapEntry>();

  if (!fs.existsSync(mapPath)) {
    return map;
  }

  try {
    const raw = fs.readFileSync(mapPath, 'utf-8');
    const entries = yaml.load(raw) as ScreenshotMapEntry[] | null;
    if (Array.isArray(entries)) {
      for (const entry of entries) {
        map.set(entry.asset_path, entry);
      }
    }
  } catch (err) {
    console.warn(`Warning: Could not parse screenshot-map.yaml: ${err}`);
  }

  return map;
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

function getCliArg(flag: string): string | null {
  const idx = process.argv.indexOf(flag);
  if (idx >= 0 && idx + 1 < process.argv.length) {
    return process.argv[idx + 1];
  }
  return null;
}

function writeEmptyResults(repoRoot: string, outputDir: string): void {
  const resultsPath = path.join(repoRoot, outputDir, 'diff-results.json');
  fs.mkdirSync(path.dirname(resultsPath), {recursive: true});
  fs.writeFileSync(resultsPath, JSON.stringify([], null, 2));
}

function printSummary(results: DiffResult[]): void {
  const byStatus: Record<string, number> = {};
  for (const r of results) {
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
  }

  console.log('\n=== Capture + Diff Summary ===');
  console.log(`Total processed: ${results.length}`);
  for (const [status, count] of Object.entries(byStatus)) {
    console.log(`  ${status}: ${count}`);
  }

  // Show diff distribution
  const withDiffs = results.filter(r => r.diff_pct !== null);
  if (withDiffs.length > 0) {
    const diffs = withDiffs.map(r => r.diff_pct!);
    const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    const min = Math.min(...diffs);
    const max = Math.max(...diffs);
    console.log(`\nDiff distribution (${withDiffs.length} images):`);
    console.log(`  Min: ${(min * 100).toFixed(2)}%`);
    console.log(`  Max: ${(max * 100).toFixed(2)}%`);
    console.log(`  Avg: ${(avg * 100).toFixed(2)}%`);
  }
}

// ── Entry Point ──

main().catch(err => {
  console.error('Capture + Diff failed:', err);
  process.exit(1);
});
