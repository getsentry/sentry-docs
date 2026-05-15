#!/usr/bin/env ts-node

/**
 * Linear Issue Creator (Section 2.4 of Tech Spec)
 *
 * Creates Linear issues for items that require human intervention:
 * needs_review, capture_failed, annotated_screenshot, arcade_embed.
 *
 * Usage:
 *   npx ts-node scripts/screenshot-pipeline/src/create-linear-issues.ts
 *   npx ts-node scripts/screenshot-pipeline/src/create-linear-issues.ts --dry-run
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  AssetInventoryItem,
  DiffResult,
  LinearIssueData,
  loadPipelineConfig,
} from './lib/types';
import {ScreenshotLinearClient, LinearIssueResult} from './lib/linear-client';

// ── Main ──

async function main() {
  const config = loadPipelineConfig();
  const repoRoot = findRepoRoot();
  const dryRun = process.argv.includes('--dry-run') || config.dry_run;

  console.log('=== Screenshot Pipeline: Linear Issue Creator ===');
  console.log(`Dry run: ${dryRun}`);
  console.log('');

  // Load diff results (for screenshot issues)
  const resultsPath = path.join(repoRoot, config.output_dir, 'diff-results.json');
  const diffResults: DiffResult[] = fs.existsSync(resultsPath)
    ? JSON.parse(fs.readFileSync(resultsPath, 'utf-8'))
    : [];

  // Load inventory manifest (for arcade and annotated items)
  const manifestPath = path.join(repoRoot, config.output_dir, 'inventory-manifest.json');
  const inventory: AssetInventoryItem[] = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    : [];

  // Collect items that need Linear issues

  // 1. From diff results: needs_review and capture_failed
  const fromDiffs = diffResults
    .filter(r => r.status === 'needs_review' || r.status === 'capture_failed')
    .map(r => buildIssueFromDiffResult(r));

  // 2. From inventory: stale arcade embeds
  const arcadeItems = inventory
    .filter(item => item.asset_type === 'arcade_embed' && item.is_stale)
    .map(item => buildIssueFromArcade(item));

  // 3. From inventory: annotated screenshots
  const annotatedItems = inventory
    .filter(item => item.asset_type === 'annotated_screenshot' && item.is_stale)
    .map(item => buildIssueFromAnnotated(item));

  // 4. From inventory: stale screenshots without URL mapping (unmapped)
  const mappedAssets = new Set(diffResults.map(r => r.inventory_item.asset_path));
  const unmappedItems = inventory
    .filter(
      item =>
        item.asset_type === 'standard_screenshot' &&
        item.is_stale &&
        !mappedAssets.has(item.asset_path) &&
        item.ui_page_url === null
    )
    // Deduplicate by asset_path
    .filter((item, idx, arr) => arr.findIndex(i => i.asset_path === item.asset_path) === idx)
    .map(item => buildIssueFromUnmapped(item));

  const allIssues = [...fromDiffs, ...arcadeItems, ...annotatedItems, ...unmappedItems];

  console.log(`Issues to create:`);
  console.log(`  From diff results: ${fromDiffs.length}`);
  console.log(`  Arcade embeds: ${arcadeItems.length}`);
  console.log(`  Annotated screenshots: ${annotatedItems.length}`);
  console.log(`  Unmapped screenshots: ${unmappedItems.length}`);
  console.log(`  Total: ${allIssues.length}`);
  console.log('');

  if (allIssues.length === 0) {
    console.log('No Linear issues to create.');
    return;
  }

  // Initialize Linear client
  const linearApiKey = process.env.LINEAR_API_KEY;
  const linearTeamId = process.env.LINEAR_TEAM_ID;

  if (!linearApiKey && !dryRun) {
    console.error('Error: LINEAR_API_KEY environment variable is required.');
    process.exit(1);
  }

  if (!linearTeamId && !dryRun) {
    console.error('Error: LINEAR_TEAM_ID environment variable is required.');
    process.exit(1);
  }

  const linearClient = new ScreenshotLinearClient({
    apiKey: linearApiKey || 'dry-run-key',
    teamId: linearTeamId || 'dry-run-team',
    dryRun,
  });

  // Create issues
  const results: LinearIssueResult[] = [];

  for (let i = 0; i < allIssues.length; i++) {
    const issue = allIssues[i];
    const progress = `[${i + 1}/${allIssues.length}]`;
    console.log(`${progress} ${issue.title}`);

    try {
      const result = await linearClient.createIssue(issue);
      results.push(result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`  Failed: ${errorMsg}`);
    }

    // Rate limiting: small delay between requests
    if (!dryRun && i < allIssues.length - 1) {
      await sleep(500);
    }
  }

  // Summary
  const newIssues = results.filter(r => r.isNew);
  const duplicates = results.filter(r => !r.isNew);

  console.log('\n=== Linear Issue Summary ===');
  console.log(`Created: ${newIssues.length}`);
  console.log(`Skipped (duplicates): ${duplicates.length}`);

  // Write results for logging/debugging
  const issueResultsPath = path.join(repoRoot, config.output_dir, 'linear-issues.json');
  fs.writeFileSync(issueResultsPath, JSON.stringify(results, null, 2));
  console.log(`\nResults written to: ${issueResultsPath}`);
}

// ── Issue Builders ──

function buildIssueFromDiffResult(result: DiffResult): LinearIssueData {
  const item = result.inventory_item;
  const diffPctStr = result.diff_pct !== null ? `${(result.diff_pct * 100).toFixed(2)}%` : 'N/A';

  const labels = ['docs-screenshots', 'Playwright'];

  let reason: string;
  if (result.status === 'capture_failed') {
    reason = `Capture failed: ${result.error || 'unknown error'}`;
    labels.push('auth-complex');
  } else {
    reason = `Screenshot diff of ${diffPctStr} requires human review (page may have dynamic content or the diff exceeds the high threshold).`;
    labels.push('needs-review');
  }

  return {
    title: `[Docs Screenshot] Update ${path.basename(item.asset_path)}`,
    description: buildDescription(item, reason, diffPctStr, result.diff_image_path),
    labels,
    team_id: process.env.LINEAR_TEAM_ID || '',
    asset_path: item.asset_path,
  };
}

function buildIssueFromArcade(item: AssetInventoryItem): LinearIssueData {
  return {
    title: `[Docs Arcade] Re-record ${item.asset_path.split('/').pop() || 'arcade embed'}`,
    description: buildArcadeDescription(item),
    labels: ['docs-screenshots', 'Playwright', 'arcade'],
    team_id: process.env.LINEAR_TEAM_ID || '',
    asset_path: item.asset_path,
  };
}

function buildIssueFromAnnotated(item: AssetInventoryItem): LinearIssueData {
  return {
    title: `[Docs Screenshot] Redo annotated ${path.basename(item.asset_path)}`,
    description: buildDescription(
      item,
      'This screenshot has annotations (callouts, arrows, highlights) that cannot be auto-replaced. A manual redo is needed.',
      'N/A',
      null
    ),
    labels: ['docs-screenshots', 'Playwright', 'annotated'],
    team_id: process.env.LINEAR_TEAM_ID || '',
    asset_path: item.asset_path,
  };
}

function buildIssueFromUnmapped(item: AssetInventoryItem): LinearIssueData {
  return {
    title: `[Docs Screenshot] Map & update ${path.basename(item.asset_path)}`,
    description: buildDescription(
      item,
      'This stale screenshot has no URL mapping in `screenshot-map.yaml`. It needs to be mapped to a Sentry UI page before it can be auto-captured.',
      'N/A',
      null
    ),
    labels: ['docs-screenshots', 'Playwright', 'needs-review'],
    team_id: process.env.LINEAR_TEAM_ID || '',
    asset_path: item.asset_path,
  };
}

// ── Description Builders ──

function buildDescription(
  item: AssetInventoryItem,
  reason: string,
  diffPct: string,
  diffImagePath: string | null
): string {
  const docsUrl = `https://docs.sentry.io/${item.doc_path
    .replace(/^docs\//, '')
    .replace(/\/index\.mdx$/, '/')
    .replace(/\.mdx$/, '/')}`;

  let desc = `## Stale Screenshot Update

**Asset:** \`${item.asset_path}\`
**Doc page:** [${item.doc_path}](${docsUrl})
**Last modified:** ${item.last_modified || 'unknown'}
**Diff percentage:** ${diffPct}

### Reason

${reason}

### Action Required

1. Navigate to the relevant Sentry UI page
2. Capture a fresh screenshot
3. Replace the image at \`${item.asset_path}\`
4. Verify alt text is still appropriate: ${item.alt_text ? `"${item.alt_text}"` : '_no alt text_'}
`;

  if (item.ui_page_url) {
    desc += `\n### Sentry UI Page\n\n${item.ui_page_url}\n`;
  }

  return desc;
}

function buildArcadeDescription(item: AssetInventoryItem): string {
  const docsUrl = `https://docs.sentry.io/${item.doc_path
    .replace(/^docs\//, '')
    .replace(/\/index\.mdx$/, '/')
    .replace(/\.mdx$/, '/')}`;

  return `## Stale Arcade Embed

**Arcade URL:** ${item.asset_path}
**Doc page:** [${item.doc_path}](${docsUrl})
**Last modified (doc):** ${item.last_modified || 'unknown'}

### Action Required

1. Re-record this Arcade walkthrough to reflect the current Sentry UI
2. Update the Arcade embed URL in \`${item.doc_path}\`
3. Verify the walkthrough still covers the same user flow

### Current Embed Reference

\`\`\`
${item.raw_reference}
\`\`\`
`;
}

// ── Helpers ──

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
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

// ── Entry Point ──

main().catch(err => {
  console.error('Linear issue creation failed:', err);
  process.exit(1);
});
