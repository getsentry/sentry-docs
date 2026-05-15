# Tech Spec: Automated Documentation Screenshot Pipeline

**Status:** Draft
**Last updated:** 2026-03-24

---

## 1. Architecture Overview

The system consists of four components that run sequentially in a GitHub Actions workflow:

```
[1. Inventory Crawler] -> [2. Screenshot Capturer + Differ] -> [3. Auto-Replacer] -> [4. Linear Issue Creator]
```

All components are Playwright scripts (TypeScript/Node.js) orchestrated by GitHub Actions. No external SaaS dependencies are required.

## 2. Component Details

### 2.1 Inventory Crawler

**Purpose:** Scan the docs repo, identify every screenshot and Arcade embed, and classify staleness.

**Input:** Docs repo file tree + Git history.

**Process:**

1. Walk the docs content directory (`docs/` and `includes/`). Parse each Markdown/MDX file.
2. Extract all image references (`![alt](path)`, `<img>` tags) and Arcade embed references (`<Arcade>` components or iframe embeds).
3. For each asset, query Git history (`git log --follow -1 --format=%aI -- <filepath>`) to get the last-modified date.
4. Compare last-modified date against a configurable `UI_REFRESH_CUTOFF` date. Flag assets modified before the cutoff as stale.
5. Classify each stale asset:
   - `arcade_embed` -- detected by component name or iframe src pattern.
   - `annotated_screenshot` -- detected by manual override in `screenshot-config.yaml`.
   - `standard_screenshot` -- everything else.

**Output:** A JSON manifest file:

```json
[
  {
    "doc_path": "docs/product/alerts/index.mdx",
    "asset_path": "docs/product/alerts/img/alert-listing.png",
    "asset_type": "standard_screenshot",
    "last_modified": "2025-01-15T10:30:00Z",
    "is_stale": true,
    "ui_page_url": null,
    "element_selector": null
  }
]
```

**Annotation Detection:** Annotated screenshots are rare in this codebase and there are no naming conventions. Detection relies on:

1. Manual override file (`screenshot-config.yaml`) where writers can flag images as annotated.
2. Future: color histogram check for annotation-typical overlays (bright red/yellow/orange).

### 2.2 Screenshot Capturer + Differ

**Purpose:** For each stale `standard_screenshot`, navigate to the corresponding Sentry UI page, capture a fresh screenshot, and compute a pixel diff.

**Input:** The inventory manifest (filtered to `standard_screenshot` entries that have a `ui_page_url` populated via `screenshot-map.yaml`).

**Prerequisites:** Each screenshot must be mapped to a Sentry UI URL and an optional CSS selector. This mapping lives in a config file (`screenshot-map.yaml`):

```yaml
- asset_path: docs/product/alerts/img/alert-listing.png
  ui_page_url: https://sentry.io/organizations/{org}/alerts/rules/
  element_selector: null  # null = full viewport
  viewport: { width: 1280, height: 800 }
  auth_required: true
  deterministic: true
  wait_for: null  # optional CSS selector to wait for
  ignore_regions: []  # only for truly ephemeral content (timestamps, user avatars)
  # NOTE: DO include nav/sidebar/top bar -- they changed in the UI refresh
  # and detecting those changes is the whole point.
```

**Process:**

1. Launch Playwright Chromium browser.
2. Authenticate to Sentry (see section 3 Auth Strategy).
3. For each entry:
   a. Navigate to `ui_page_url`. Wait for network idle + configurable selector visibility.
   b. If `element_selector` is set, capture element screenshot. Otherwise, capture full viewport.
   c. Save capture as PNG to a temp directory.
   d. Optimize image using `sharp` (compress while maintaining quality).
   e. Run pixel diff (using `pixelmatch` library) between the existing image and the new capture.
   f. Compute diff percentage: `changed_pixels / total_pixels`.
   g. Record result:
      - `diff_pct`: the percentage of changed pixels
      - `capture_path`: path to the new screenshot
      - `status`: classification (see below)

**Diff Classification (Three-Threshold Model):**

| Condition | Status |
|-----------|--------|
| `diff_pct < DIFF_THRESHOLD_LOW` (default: 1%) | `unchanged` -- skip, no action needed |
| `diff_pct >= DIFF_THRESHOLD_LOW` AND `< DIFF_THRESHOLD_HIGH` AND `deterministic: true` | `auto_replace` |
| `diff_pct >= DIFF_THRESHOLD_LOW` AND `< DIFF_THRESHOLD_HIGH` AND `deterministic: false` | `needs_review` |
| `diff_pct >= DIFF_THRESHOLD_HIGH` (default: 50%) | `needs_review` -- suspiciously large change |
| Capture failed (timeout, selector not found, auth error) | `capture_failed` |

**Output:** Enriched manifest with diff results.

**Configurable thresholds (env vars):**

- `DIFF_THRESHOLD_LOW`: minimum diff % to consider a screenshot changed (default: `0.01` / 1%)
- `DIFF_THRESHOLD_HIGH`: maximum diff % before flagging for review even on deterministic pages (default: `0.50` / 50%)
- `CAPTURE_TIMEOUT_MS`: navigation timeout per page (default: `30000`)
- `WAIT_FOR_SELECTOR_TIMEOUT_MS`: element wait timeout (default: `10000`)

### 2.3 Auto-Replacer

**Purpose:** For all `auto_replace` entries, copy the new capture over the old image and commit.

**Process:**

1. Filter manifest to `status: auto_replace`.
2. For each entry, copy the captured (and optimized) PNG to the original `asset_path`, overwriting the old image.
3. Stage all changed files. Create a single Git commit: `chore(docs): auto-replace N stale screenshots`.
4. Push to a new branch: `docs/auto-screenshot-update-{date}`.
5. Open a pull request with a summary table of all replacements for human review before merge.
   - Reviewers: `getsentry/docs`, `getsentry/product-owners-docs`

### 2.4 Linear Issue Creator

**Purpose:** Create one Linear issue per item that requires human intervention.

**Input:** Manifest entries with status `needs_review`, `capture_failed`, `annotated_screenshot`, or `arcade_embed`.

**Process:**

1. Connect to Linear via `@linear/sdk`.
2. For each entry, create an issue:
   - **Title:** `[Docs Screenshot] Update {asset_path}` or `[Docs Arcade] Re-record {asset_path}`
   - **Description:** Include doc page URL, current screenshot (as image link), classification reason, and diff percentage (if applicable).
   - **Labels:** `docs-screenshots`, `Playwright`, plus classification label (`needs-review`, `annotated`, `arcade`, `auth-complex`).
   - **Team:** DOCS (configurable via env var `LINEAR_TEAM_ID`).
3. Deduplicate: before creating, check if an open issue with the same `asset_path` in the title already exists. Skip if so.

**Output:** List of created Linear issue IDs, logged to the workflow summary.

## 3. Auth Strategy

Playwright authenticates to Sentry using a service account. Implementation:

1. **Initial setup:** Run `npx playwright codegen` to interactively log in and capture the auth flow. Save the resulting storage state (`storageState.json`) as a GitHub Actions secret (base64-encoded).
2. **In CI:** Decode the secret, write to disk, and pass as `storageState` in `browser.newContext()`.
3. **Token refresh:** If using API token auth instead of session cookies, store the token as a GitHub secret and inject via env var. Playwright scripts pass it as a cookie or header.
4. **Fallback:** If auth state expires mid-run, the capture script catches the auth redirect, logs the failure as `capture_failed`, and continues.

## 4. Linear Integration

Use `@linear/sdk` npm package with a `LINEAR_API_KEY` stored as a GitHub secret.

The script abstracts this behind an interface so the integration method can be swapped without changing the pipeline logic.

## 5. GitHub Actions Workflow

```yaml
name: Screenshot Pipeline

on:
  schedule:
    - cron: '0 6 * * 1'  # Weekly on Monday at 6am UTC
  workflow_dispatch:      # Manual trigger

jobs:
  screenshot-pipeline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for git log queries

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - uses: pnpm/action-setup@v2

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Restore auth state
        run: echo "$SENTRY_STORAGE_STATE" | base64 -d > /tmp/storageState.json
        env:
          SENTRY_STORAGE_STATE: ${{ secrets.SENTRY_STORAGE_STATE }}

      - name: Run inventory crawler
        run: npx ts-node scripts/screenshot-pipeline/src/crawl-inventory.ts
        env:
          UI_REFRESH_CUTOFF: '2025-06-01'

      - name: Run screenshot capture & diff
        run: npx ts-node scripts/screenshot-pipeline/src/capture-and-diff.ts
        env:
          SENTRY_STORAGE_STATE_PATH: /tmp/storageState.json
          SENTRY_ORG_SLUG: ${{ secrets.SENTRY_ORG_SLUG }}

      - name: Auto-replace and open PR
        run: npx ts-node scripts/screenshot-pipeline/src/auto-replace.ts
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Create Linear issues
        run: npx ts-node scripts/screenshot-pipeline/src/create-linear-issues.ts
        env:
          LINEAR_API_KEY: ${{ secrets.LINEAR_API_KEY }}
          LINEAR_TEAM_ID: ${{ vars.LINEAR_TEAM_ID }}
```

## 6. File Structure

```
scripts/screenshot-pipeline/
  ├── PRD.md                        # Product requirements
  ├── TECH-SPEC.md                  # This document
  ├── package.json                  # Pipeline-specific dependencies
  ├── tsconfig.json                 # TypeScript config
  ├── playwright.config.ts          # Playwright configuration
  ├── src/
  │   ├── crawl-inventory.ts        # Inventory Crawler
  │   ├── capture-and-diff.ts       # Screenshot Capturer + Differ
  │   ├── auto-replace.ts           # Auto-Replacer (commit + PR)
  │   ├── create-linear-issues.ts   # Linear Issue Creator
  │   └── lib/
  │       ├── types.ts              # Shared TypeScript types
  │       ├── auth.ts               # Sentry auth helper
  │       ├── diff.ts               # pixelmatch wrapper
  │       ├── linear-client.ts      # Linear API abstraction
  │       └── image-optimizer.ts    # Image optimization (sharp)
  ├── config/
  │   ├── screenshot-map.yaml       # URL + selector mapping per screenshot
  │   └── screenshot-config.yaml    # Manual overrides (annotated flags, etc.)
  ├── tools/
  │   └── generate-map-template.ts  # Helper to generate screenshot-map template
  └── output/                       # Pipeline output (gitignored)
      ├── inventory-manifest.json
      ├── diff-results.json
      └── captures/                 # Temporary screenshot captures
```

## 7. Dependencies

| Package | Purpose |
|---------|---------|
| `playwright` | Browser automation and screenshot capture |
| `pixelmatch` | Pixel-level image diffing |
| `pngjs` | PNG read/write for pixelmatch |
| `sharp` | Image optimization/compression |
| `js-yaml` | Parse YAML config files |
| `@linear/sdk` | Linear API client |
| `@octokit/rest` | GitHub PR creation |
| `gray-matter` | Parse MDX frontmatter |
| `glob` | File tree walking |
| `commander` | CLI argument parsing |

## 8. Local Developer Usage (Post-POC)

Writers can regenerate any screenshot locally:

```shell
# Regenerate a single screenshot
npx ts-node scripts/screenshot-pipeline/src/capture-and-diff.ts --asset docs/product/alerts/img/alert-listing.png

# Regenerate all screenshots for a doc page
npx ts-node scripts/screenshot-pipeline/src/capture-and-diff.ts --doc docs/product/alerts/index.mdx

# Dry run -- capture but don't overwrite
npx ts-node scripts/screenshot-pipeline/src/capture-and-diff.ts --dry-run
```

## 9. POC Scope

### Step 1 deliverables:

- `crawl-inventory.ts` working against 20-30 representative doc pages.
- `capture-and-diff.ts` working with auth against Sentry staging.
- `screenshot-map.yaml` populated for the POC page set.
- Validated: auth flows work, captures are usable, diff thresholds are sane.

### Step 2 deliverables:

- `create-linear-issues.ts` creating real issues in a test Linear project.
- `auto-replace.ts` opening a PR with replaced screenshots.
- GitHub Actions workflow running end-to-end on manual trigger.
- Decision doc: observed auto-replace accuracy, recommended thresholds, go/no-go for full rollout.
