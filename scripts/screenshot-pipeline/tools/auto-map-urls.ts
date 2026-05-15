#!/usr/bin/env ts-node

/**
 * Auto-Map URLs
 *
 * Cross-references stale screenshots against known Sentry UI routes
 * to auto-fill screenshot-map.yaml entries.
 *
 * Primary strategy: the MDX file's path in the docs repo mirrors the Sentry
 * UI structure. For example:
 *   docs/product/alerts/create-alerts/issue-alert-config.mdx
 *   -> https://sentry.io/organizations/{org}/alerts/new/issue/
 *
 * Secondary strategy: keyword matching on filename and alt text for
 * more specific page targeting within a section.
 *
 * Usage:
 *   npx ts-node scripts/screenshot-pipeline/tools/auto-map-urls.ts
 *   npx ts-node scripts/screenshot-pipeline/tools/auto-map-urls.ts --scope docs/product/insights
 */

import * as fs from 'fs';
import * as path from 'path';
import {AssetInventoryItem} from '../src/lib/types';

// ── Doc Path -> Sentry URL Mapping ──
// Maps the MDX doc path prefix to the corresponding Sentry UI URL.
// More specific paths are checked first (longest prefix match wins).

interface DocPathRoute {
  /** Doc path prefix (after docs/) to match against */
  docPathPrefix: string;
  /** Sentry UI URL. {org} = org slug placeholder. */
  url: string;
  description: string;
  deterministic: boolean;
}

// Ordered from most specific to least specific.
// NOTE: deterministic is set to true for most pages because we capture
// against a demo account with controlled/synthetic data. Pages only need
// deterministic: false if they show truly ephemeral content that changes
// on every page load even in the demo org (e.g., live timestamps, "X ago").
//
// IMPORTANT: This mapping must be kept in sync with the docs directory
// structure. The crawler discovers assets by walking the file tree, so
// when docs are reorganized these prefixes need to be updated.
// Run `npm run crawl` then check the inventory for new section paths.
const DOC_PATH_ROUTES: DocPathRoute[] = [
  // ── Monitors & Alerts (formerly alerts/ and crons/) ──
  {docPathPrefix: 'product/monitors-and-alerts/alerts', url: 'https://sentry.io/organizations/{org}/alerts/rules/', description: 'Alerts', deterministic: true},
  {docPathPrefix: 'product/monitors-and-alerts/monitors', url: 'https://sentry.io/organizations/{org}/monitors/', description: 'Monitors (crons/uptime)', deterministic: true},
  {docPathPrefix: 'product/monitors-and-alerts', url: 'https://sentry.io/organizations/{org}/monitors/', description: 'Monitors & alerts', deterministic: true},

  // ── Notifications (formerly alerts/notifications) ──
  {docPathPrefix: 'product/notifications', url: 'https://sentry.io/settings/account/notifications/', description: 'Notification settings', deterministic: true},

  // ── Issues ──
  {docPathPrefix: 'product/issues/issue-details/performance-issues', url: 'https://sentry.io/organizations/{org}/issues/', description: 'Performance issue detail', deterministic: true},
  {docPathPrefix: 'product/issues/issue-details', url: 'https://sentry.io/organizations/{org}/issues/', description: 'Issue details', deterministic: true},
  {docPathPrefix: 'product/issues/issue-views', url: 'https://sentry.io/organizations/{org}/issues/views/', description: 'Issue views', deterministic: true},
  {docPathPrefix: 'product/issues/suspect-commits', url: 'https://sentry.io/organizations/{org}/issues/', description: 'Suspect commits', deterministic: true},
  {docPathPrefix: 'product/issues/ownership-rules', url: 'https://sentry.io/organizations/{org}/issues/', description: 'Ownership rules', deterministic: true},
  {docPathPrefix: 'product/issues/grouping-and-fingerprints', url: 'https://sentry.io/organizations/{org}/issues/', description: 'Issue grouping', deterministic: true},
  {docPathPrefix: 'product/issues/issue-priority', url: 'https://sentry.io/organizations/{org}/issues/', description: 'Issue priority', deterministic: true},
  {docPathPrefix: 'product/issues/states-triage', url: 'https://sentry.io/organizations/{org}/issues/', description: 'Issue states & triage', deterministic: true},
  {docPathPrefix: 'product/issues/reprocessing', url: 'https://sentry.io/organizations/{org}/issues/', description: 'Reprocessing', deterministic: true},
  {docPathPrefix: 'product/issues', url: 'https://sentry.io/organizations/{org}/issues/', description: 'Issues', deterministic: true},

  // ── Explore ──
  {docPathPrefix: 'product/explore/discover-queries', url: 'https://sentry.io/organizations/{org}/explore/discover/homepage/', description: 'Discover queries', deterministic: true},
  {docPathPrefix: 'product/explore/profiling', url: 'https://sentry.io/organizations/{org}/explore/profiling/', description: 'Profiling', deterministic: true},
  {docPathPrefix: 'product/explore/trace-explorer', url: 'https://sentry.io/organizations/{org}/explore/traces/', description: 'Trace explorer', deterministic: true},
  {docPathPrefix: 'product/explore/session-replay', url: 'https://sentry.io/organizations/{org}/explore/replays/', description: 'Session replay', deterministic: true},
  {docPathPrefix: 'product/explore/logs', url: 'https://sentry.io/organizations/{org}/explore/logs/', description: 'Logs', deterministic: true},
  {docPathPrefix: 'product/explore/metrics', url: 'https://sentry.io/organizations/{org}/explore/metrics/', description: 'Metrics', deterministic: true},
  {docPathPrefix: 'product/explore', url: 'https://sentry.io/organizations/{org}/explore/', description: 'Explore', deterministic: true},

  // ── Dashboards ──
  {docPathPrefix: 'product/dashboards/widget-builder', url: 'https://sentry.io/organizations/{org}/dashboards/new/', description: 'Widget builder', deterministic: true},
  {docPathPrefix: 'product/dashboards/widget-library', url: 'https://sentry.io/organizations/{org}/dashboards/new/', description: 'Widget library', deterministic: true},
  {docPathPrefix: 'product/dashboards/sentry-dashboards', url: 'https://sentry.io/organizations/{org}/dashboards/', description: 'Sentry dashboards', deterministic: true},
  {docPathPrefix: 'product/dashboards/custom-dashboards', url: 'https://sentry.io/organizations/{org}/dashboards/', description: 'Custom dashboards', deterministic: true},
  {docPathPrefix: 'product/dashboards', url: 'https://sentry.io/organizations/{org}/dashboards/', description: 'Dashboards', deterministic: true},

  // ── Releases ──
  {docPathPrefix: 'product/releases/health', url: 'https://sentry.io/organizations/{org}/releases/', description: 'Release health', deterministic: true},
  {docPathPrefix: 'product/releases/setup', url: 'https://sentry.io/organizations/{org}/releases/', description: 'Release setup', deterministic: true},
  {docPathPrefix: 'product/releases/release-details', url: 'https://sentry.io/organizations/{org}/releases/', description: 'Release details', deterministic: true},
  {docPathPrefix: 'product/releases/releases-throughout-sentry', url: 'https://sentry.io/organizations/{org}/releases/', description: 'Releases throughout Sentry', deterministic: true},
  {docPathPrefix: 'product/releases/usage', url: 'https://sentry.io/organizations/{org}/releases/', description: 'Release usage', deterministic: true},
  {docPathPrefix: 'product/releases', url: 'https://sentry.io/organizations/{org}/releases/', description: 'Releases', deterministic: true},

  // ── User Feedback ──
  {docPathPrefix: 'product/user-feedback', url: 'https://sentry.io/organizations/{org}/feedback/', description: 'User feedback', deterministic: true},

  // ── Projects ──
  {docPathPrefix: 'product/projects', url: 'https://sentry.io/organizations/{org}/projects/', description: 'Projects', deterministic: true},

  // ── Onboarding / Sentry Basics ──
  // Tutorial pages often show code editors/terminals, not just Sentry UI.
  {docPathPrefix: 'product/onboarding', url: 'https://sentry.io/organizations/{org}/projects/new/', description: 'Onboarding', deterministic: true},
  {docPathPrefix: 'product/sentry-basics/integrate-frontend', url: 'https://sentry.io/organizations/{org}/issues/', description: 'Frontend tutorial', deterministic: false},
  {docPathPrefix: 'product/sentry-basics/integrate-backend', url: 'https://sentry.io/organizations/{org}/issues/', description: 'Backend tutorial', deterministic: false},
  {docPathPrefix: 'product/sentry-basics/distributed-tracing', url: 'https://sentry.io/organizations/{org}/explore/traces/', description: 'Distributed tracing tutorial', deterministic: true},
  {docPathPrefix: 'product/sentry-basics', url: 'https://sentry.io/organizations/{org}/issues/', description: 'Sentry basics', deterministic: true},

  // ── Other ──
  {docPathPrefix: 'product/relay', url: 'https://sentry.io/settings/{org}/relay/', description: 'Relay settings', deterministic: true},
  {docPathPrefix: 'product/sentry-toolbar', url: 'https://sentry.io/organizations/{org}/issues/', description: 'Sentry toolbar', deterministic: true},
  {docPathPrefix: 'product/codecov', url: 'https://sentry.io/organizations/{org}/issues/', description: 'Codecov integration', deterministic: false},
  {docPathPrefix: 'product/stats', url: 'https://sentry.io/organizations/{org}/stats/', description: 'Organization stats', deterministic: true},
  {docPathPrefix: 'product/snapshots', url: 'https://sentry.io/organizations/{org}/preprod/', description: 'Snapshots', deterministic: true},

  // ── Settings (from organization/ docs path) ──
  {docPathPrefix: 'organization/integrations', url: 'https://sentry.io/settings/{org}/integrations/', description: 'Integrations settings', deterministic: true},
  {docPathPrefix: 'organization/dynamic-sampling', url: 'https://sentry.io/settings/{org}/dynamic-sampling/', description: 'Dynamic sampling', deterministic: true},
  {docPathPrefix: 'organization', url: 'https://sentry.io/settings/{org}/', description: 'Organization settings', deterministic: true},
];

// ── Keyword refinements ──
// Used AFTER doc-path matching to try to pick a more specific URL within the section

interface KeywordRefinement {
  keywords: string[];
  url: string;
  description: string;
  deterministic: boolean;
}

const KEYWORD_REFINEMENTS: KeywordRefinement[] = [
  // Alerts subsections
  {keywords: ['alert-listing', 'alerts-list', 'alert-rules'], url: 'https://sentry.io/organizations/{org}/alerts/rules/', description: 'Alert rules list', deterministic: true},
  {keywords: ['alert-details', 'alert-detail', 'incident'], url: 'https://sentry.io/organizations/{org}/alerts/', description: 'Alert detail/incident', deterministic: true},
  {keywords: ['create-new-alert', 'new-alert', 'alert-wizard'], url: 'https://sentry.io/organizations/{org}/alerts/wizard/', description: 'Alert wizard', deterministic: true},

  // Issues subsections
  {keywords: ['issue-list', 'issues-list', 'issue_page', 'issue-stream'], url: 'https://sentry.io/organizations/{org}/issues/', description: 'Issues list', deterministic: true},
  {keywords: ['stack-trace', 'stacktrace', 'exception'], url: 'https://sentry.io/organizations/{org}/issues/', description: 'Stack trace', deterministic: true},
  {keywords: ['breadcrumb'], url: 'https://sentry.io/organizations/{org}/issues/', description: 'Breadcrumbs', deterministic: true},

  // Insights subsections
  {keywords: ['web-vital', 'pageload', 'lcp', 'fcp', 'cls', 'inp', 'ttfb'], url: 'https://sentry.io/organizations/{org}/insights/frontend/pageloads/', description: 'Web Vitals', deterministic: true},
  {keywords: ['database', 'db-query', 'query-source', 'slow-query'], url: 'https://sentry.io/organizations/{org}/insights/backend/database/', description: 'Database queries', deterministic: true},
  {keywords: ['cache', 'caches'], url: 'https://sentry.io/organizations/{org}/insights/backend/caches/', description: 'Caches', deterministic: true},
  {keywords: ['queue', 'queues'], url: 'https://sentry.io/organizations/{org}/insights/backend/queues/', description: 'Queues', deterministic: true},
  {keywords: ['app-start', 'cold-start', 'warm-start', 'app-startup'], url: 'https://sentry.io/organizations/{org}/insights/mobile/mobile-vitals/', description: 'App starts', deterministic: true},
  {keywords: ['screen-load', 'ttid', 'ttfd'], url: 'https://sentry.io/organizations/{org}/insights/mobile/mobile-vitals/', description: 'Screen loads', deterministic: true},
  {keywords: ['slow-frame', 'frozen-frame'], url: 'https://sentry.io/organizations/{org}/insights/mobile/mobile-vitals/', description: 'Frames', deterministic: true},
  {keywords: ['transaction-summary', 'exclusive-time', 'span-self-time'], url: 'https://sentry.io/organizations/{org}/insights/summary/', description: 'Transaction summary', deterministic: true},

  // Explore subsections
  {keywords: ['flamegraph', 'flamechart', 'profile'], url: 'https://sentry.io/organizations/{org}/explore/profiling/', description: 'Profiling', deterministic: true},
  {keywords: ['replay', 'session-replay'], url: 'https://sentry.io/organizations/{org}/explore/replays/', description: 'Replays', deterministic: true},
  {keywords: ['trace-detail', 'trace-view', 'distributed-trace'], url: 'https://sentry.io/organizations/{org}/explore/traces/', description: 'Traces', deterministic: true},

  // Dashboards
  {keywords: ['widget-builder', 'widget-library'], url: 'https://sentry.io/organizations/{org}/dashboards/new/', description: 'Widget builder', deterministic: true},

  // Settings-related screenshots within product docs
  {keywords: ['source-map', 'sourcemap'], url: 'https://sentry.io/settings/{org}/projects/', description: 'Source maps', deterministic: true},
  {keywords: ['integration', 'github-integration', 'slack-integration'], url: 'https://sentry.io/settings/{org}/integrations/', description: 'Integrations', deterministic: true},
  {keywords: ['notification', 'notification-setting'], url: 'https://sentry.io/settings/account/notifications/', description: 'Notifications', deterministic: true},
  {keywords: ['code-mapping', 'code-owner', 'codeowner'], url: 'https://sentry.io/settings/{org}/integrations/', description: 'Code mappings', deterministic: true},
  {keywords: ['ownership-rule', 'ownership'], url: 'https://sentry.io/settings/{org}/projects/', description: 'Ownership rules', deterministic: true},
  {keywords: ['dynamic-sampling', 'sampling'], url: 'https://sentry.io/settings/{org}/dynamic-sampling/', description: 'Dynamic sampling', deterministic: true},
];

// ── Matching Logic ──

interface MatchResult {
  item: AssetInventoryItem;
  url: string;
  description: string;
  deterministic: boolean;
  confidence: 'high' | 'medium' | 'low' | 'none';
  matchSource: string; // why this matched
}

function matchScreenshot(item: AssetInventoryItem): MatchResult {
  const docPath = item.doc_path.replace(/^docs\//, '');
  const filename = path.basename(item.asset_path, path.extname(item.asset_path)).toLowerCase();
  const normalizedFilename = filename.replace(/[-_]/g, ' ');
  const altText = (item.alt_text || '').toLowerCase();

  // Step 1: Find the best doc-path match (longest prefix wins)
  let pathMatch: DocPathRoute | null = null;
  for (const route of DOC_PATH_ROUTES) {
    if (docPath.startsWith(route.docPathPrefix)) {
      pathMatch = route;
      break; // first match is most specific since list is ordered
    }
  }

  if (!pathMatch) {
    return {
      item,
      url: '',
      description: 'No match',
      deterministic: false,
      confidence: 'none',
      matchSource: 'no doc path match',
    };
  }

  // Step 2: Try keyword refinement for a more specific URL
  let refinedMatch: KeywordRefinement | null = null;
  let bestKeywordScore = 0;
  let bestKeywords: string[] = [];

  for (const refinement of KEYWORD_REFINEMENTS) {
    let score = 0;
    const matched: string[] = [];

    for (const keyword of refinement.keywords) {
      const normalized = keyword.replace(/[-_]/g, ' ').toLowerCase();
      if (normalizedFilename.includes(normalized)) {
        score += 5;
        matched.push(keyword);
      } else if (altText.includes(normalized)) {
        score += 3;
        matched.push(keyword);
      }
    }

    if (score > bestKeywordScore) {
      bestKeywordScore = score;
      refinedMatch = refinement;
      bestKeywords = matched;
    }
  }

  // Step 3: Determine final URL and confidence
  if (refinedMatch && bestKeywordScore >= 5) {
    // Strong keyword match refines the doc-path URL
    return {
      item,
      url: refinedMatch.url,
      description: refinedMatch.description,
      deterministic: refinedMatch.deterministic,
      confidence: 'high',
      matchSource: `doc-path: ${pathMatch.docPathPrefix} + keywords: [${bestKeywords.join(', ')}]`,
    };
  }

  if (refinedMatch && bestKeywordScore >= 3) {
    // Moderate keyword match
    return {
      item,
      url: refinedMatch.url,
      description: refinedMatch.description,
      deterministic: refinedMatch.deterministic,
      confidence: 'medium',
      matchSource: `doc-path: ${pathMatch.docPathPrefix} + keywords: [${bestKeywords.join(', ')}]`,
    };
  }

  // Doc path match only (no keyword refinement)
  // Check how specific the path match is
  const pathDepth = pathMatch.docPathPrefix.split('/').length;
  const confidence = pathDepth >= 4 ? 'high' : pathDepth >= 3 ? 'medium' : 'low';

  return {
    item,
    url: pathMatch.url,
    description: pathMatch.description,
    deterministic: pathMatch.deterministic,
    confidence,
    matchSource: `doc-path: ${pathMatch.docPathPrefix}`,
  };
}

// ── Main ──

function main() {
  const repoRoot = findRepoRoot();
  const scope = getCliArg('--scope');

  const manifestPath = path.join(
    repoRoot,
    'scripts/screenshot-pipeline/output/inventory-manifest.json'
  );
  if (!fs.existsSync(manifestPath)) {
    console.error('Error: Run the inventory crawler first: npm run crawl');
    process.exit(1);
  }

  const inventory: AssetInventoryItem[] = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  let screenshots = inventory.filter(
    item => item.asset_type === 'standard_screenshot' && item.is_stale
  );
  if (scope) {
    screenshots = screenshots.filter(
      item => item.asset_path.startsWith(scope) || item.doc_path.startsWith(scope)
    );
  }

  // Deduplicate by asset_path
  const seen = new Set<string>();
  screenshots = screenshots.filter(item => {
    if (seen.has(item.asset_path)) return false;
    seen.add(item.asset_path);
    return true;
  });

  console.log(`Matching ${screenshots.length} stale screenshots against Sentry routes...\n`);

  const results = screenshots.map(matchScreenshot);

  // Sort by confidence then by doc path
  const confidenceOrder = {high: 0, medium: 1, low: 2, none: 3};
  results.sort((a, b) => {
    const confDiff = confidenceOrder[a.confidence] - confidenceOrder[b.confidence];
    if (confDiff !== 0) return confDiff;
    return a.item.doc_path.localeCompare(b.item.doc_path);
  });

  // Generate YAML output
  const lines: string[] = [
    '# Auto-generated URL mappings (doc-path strategy)',
    '#',
    `# Generated at: ${new Date().toISOString()}`,
    `# Total entries: ${results.length}`,
    '#',
    '# Mapping strategy:',
    '#   1. MDX doc path -> Sentry UI URL (the doc path mirrors the product structure)',
    '#   2. Filename/alt-text keywords refine to a more specific page within the section',
    '#',
    '# Confidence levels:',
    '#   HIGH   = specific doc path match (3+ levels deep) and/or strong keyword match',
    '#   MEDIUM = section-level path match or moderate keyword match',
    '#   LOW    = broad path match only, may need manual correction',
    '#   NONE   = no match found, needs manual mapping',
    '#',
    '# Review all entries before using! Auto-mapping is heuristic-based.',
    '',
  ];

  const byConfidence: Record<string, MatchResult[]> = {high: [], medium: [], low: [], none: []};
  for (const result of results) {
    byConfidence[result.confidence].push(result);
  }

  for (const [confidence, items] of Object.entries(byConfidence)) {
    if (items.length === 0) continue;

    lines.push(`# === ${confidence.toUpperCase()} CONFIDENCE (${items.length} entries) ===`);
    lines.push('');

    for (const result of items) {
      const {item} = result;

      if (result.url) {
        lines.push(`- asset_path: ${item.asset_path}`);
        lines.push(`  ui_page_url: "${result.url}"`);
        lines.push(`  element_selector: null`);
        lines.push(`  viewport: { width: 1280, height: 800 }`);
        lines.push(`  auth_required: true`);
        lines.push(`  deterministic: ${result.deterministic}`);
        lines.push(`  wait_for: null`);
        lines.push(`  ignore_regions: []`);
        lines.push(`  # confidence: ${confidence} | ${result.matchSource}`);
        lines.push(
          `  # doc: ${item.doc_path}` +
            (item.alt_text ? ` | alt: "${item.alt_text}"` : '')
        );
        lines.push(`  # route: ${result.description}`);
      } else {
        lines.push(`# - asset_path: ${item.asset_path}`);
        lines.push(`#   ui_page_url: "" # MANUAL: ${result.matchSource}`);
        lines.push(
          `#   doc: ${item.doc_path}` +
            (item.alt_text ? ` | alt: "${item.alt_text}"` : '')
        );
      }
      lines.push('');
    }
  }

  // Write output
  const outputDir = path.join(repoRoot, 'scripts/screenshot-pipeline/output');
  fs.mkdirSync(outputDir, {recursive: true});
  const outputPath = path.join(outputDir, 'screenshot-map-auto.yaml');
  fs.writeFileSync(outputPath, lines.join('\n'));

  // Print summary
  console.log('=== Auto-Map Summary ===');
  console.log(`High confidence:   ${byConfidence.high.length}`);
  console.log(`Medium confidence:  ${byConfidence.medium.length}`);
  console.log(`Low confidence:     ${byConfidence.low.length}`);
  console.log(`No match:           ${byConfidence.none.length}`);
  console.log('');
  console.log(`Written to: ${outputPath}`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Review high-confidence entries -- most should be correct');
  console.log('  2. Check medium-confidence entries and fix wrong URLs');
  console.log('  3. Manually fill in low/no-match entries');
  console.log('  4. Copy validated entries to config/screenshot-map.yaml');
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
