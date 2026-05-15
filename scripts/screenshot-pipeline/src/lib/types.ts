/**
 * Shared TypeScript types for the screenshot pipeline.
 */

// --- Asset Classification ---

export type AssetType = 'standard_screenshot' | 'annotated_screenshot' | 'arcade_embed';

export type DiffStatus =
  | 'unchanged'
  | 'auto_replace'
  | 'needs_review'
  | 'capture_failed'
  | 'unmapped'; // no URL mapping exists

// --- Inventory Manifest ---

export interface AssetInventoryItem {
  /** Path to the MDX doc file that references this asset */
  doc_path: string;
  /** Path to the image file relative to repo root, or Arcade src URL */
  asset_path: string;
  /** Classification of the asset */
  asset_type: AssetType;
  /** ISO 8601 timestamp of when the asset was last modified in Git */
  last_modified: string | null;
  /** Whether this asset is considered stale (modified before UI_REFRESH_CUTOFF) */
  is_stale: boolean;
  /** The Sentry UI page URL this screenshot corresponds to (from screenshot-map.yaml) */
  ui_page_url: string | null;
  /** CSS selector for element screenshot; null means full viewport */
  element_selector: string | null;
  /** Alt text or description from the MDX reference */
  alt_text: string | null;
  /** The raw MDX reference string (for debugging) */
  raw_reference: string;
}

// --- Screenshot Map Config ---

export interface IgnoreRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ScreenshotMapEntry {
  /** Path to the image file relative to repo root */
  asset_path: string;
  /** The Sentry UI page URL to capture. Use {org} as placeholder for org slug. */
  ui_page_url: string;
  /** CSS selector for element screenshot; null means full viewport */
  element_selector: string | null;
  /** Viewport size for capture */
  viewport: {width: number; height: number};
  /** Whether this page requires Sentry authentication */
  auth_required: boolean;
  /** Whether this page is deterministic (same data every time) */
  deterministic: boolean;
  /** Optional CSS selector to wait for before capturing */
  wait_for: string | null;
  /** Optional regions to mask/ignore during diff comparison */
  ignore_regions: IgnoreRegion[];
}

// --- Screenshot Config (Manual Overrides) ---

export interface ScreenshotConfigEntry {
  /** Path to the image file relative to repo root */
  asset_path: string;
  /** Whether this image is annotated (has callouts, arrows, highlights) */
  annotated: boolean;
  /** Whether to skip this image entirely in the pipeline */
  skip: boolean;
  /** Optional notes about why this image needs special handling */
  notes: string | null;
}

// --- Diff Results ---

export interface DiffResult {
  /** The original inventory item */
  inventory_item: AssetInventoryItem;
  /** Path to the newly captured screenshot (temp directory) */
  capture_path: string | null;
  /** Percentage of pixels that differ (0.0 - 1.0) */
  diff_pct: number | null;
  /** Path to the diff visualization image (optional) */
  diff_image_path: string | null;
  /** Final classification status */
  status: DiffStatus;
  /** Error message if capture failed */
  error: string | null;
  /** Timestamp of when this capture was taken */
  captured_at: string;
}

// --- Pipeline Config ---

export interface PipelineConfig {
  /** ISO date string. Assets modified before this date are considered stale. */
  ui_refresh_cutoff: string;
  /** Minimum diff percentage to consider a screenshot changed (default: 0.01 = 1%) */
  diff_threshold_low: number;
  /** Maximum diff percentage before flagging as suspicious even on deterministic pages (default: 0.50 = 50%) */
  diff_threshold_high: number;
  /** Navigation timeout in ms (default: 30000) */
  capture_timeout_ms: number;
  /** Element wait timeout in ms (default: 10000) */
  wait_for_selector_timeout_ms: number;
  /** Sentry org slug for URL templating */
  sentry_org_slug: string;
  /** Path to Playwright storage state file for auth */
  storage_state_path: string | null;
  /** Directories to scan for MDX content files */
  content_dirs: string[];
  /** Directories to scan for image files */
  image_dirs: string[];
  /** Path to the output directory for manifests and captures */
  output_dir: string;
  /** Whether to run in dry-run mode (no file changes, no PRs, no Linear issues) */
  dry_run: boolean;
}

// --- Linear Issue ---

export interface LinearIssueData {
  title: string;
  description: string;
  labels: string[];
  team_id: string;
  /** The asset path for deduplication */
  asset_path: string;
}

// --- Pipeline Summary ---

export interface PipelineSummary {
  /** When the pipeline was run */
  run_at: string;
  /** Total assets discovered */
  total_assets: number;
  /** Total stale assets */
  total_stale: number;
  /** Breakdown by status */
  by_status: Record<DiffStatus | 'stale_arcade' | 'stale_annotated', number>;
  /** Assets that were auto-replaced */
  auto_replaced: string[];
  /** Linear issues created */
  linear_issues_created: string[];
  /** Errors encountered */
  errors: string[];
}

/**
 * Load pipeline config from environment variables with defaults.
 */
export function loadPipelineConfig(overrides: Partial<PipelineConfig> = {}): PipelineConfig {
  return {
    ui_refresh_cutoff: process.env.UI_REFRESH_CUTOFF || '2025-06-01',
    diff_threshold_low: parseFloat(process.env.DIFF_THRESHOLD_LOW || '0.01'),
    diff_threshold_high: parseFloat(process.env.DIFF_THRESHOLD_HIGH || '0.50'),
    capture_timeout_ms: parseInt(process.env.CAPTURE_TIMEOUT_MS || '30000', 10),
    wait_for_selector_timeout_ms: parseInt(
      process.env.WAIT_FOR_SELECTOR_TIMEOUT_MS || '10000',
      10
    ),
    sentry_org_slug: process.env.SENTRY_ORG_SLUG || 'sentry',
    storage_state_path:
      process.env.SENTRY_STORAGE_STATE_PATH ||
      'scripts/screenshot-pipeline/auth/storageState.json',
    content_dirs: ['docs', 'includes', 'platform-includes'],
    image_dirs: ['docs', 'includes', 'public'],
    output_dir: 'scripts/screenshot-pipeline/output',
    dry_run: process.env.DRY_RUN === 'true',
    ...overrides,
  };
}
