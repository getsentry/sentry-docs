# Screenshot Pipeline

Automated screenshot capture, diff, and replacement pipeline for Sentry documentation. Detects stale screenshots, auto-replaces high-confidence matches, and creates Linear issues for everything requiring manual review.

## How It Works

1. **Crawl** -- Scans MDX files for image references and Arcade embeds, checks Git history for staleness
2. **Capture** -- Uses Playwright to visit Sentry UI pages and take fresh screenshots
3. **Diff** -- Compares old vs new screenshots using pixel-level diffing
4. **Replace or Ticket** -- Auto-replaces high-confidence diffs in a PR; creates Linear issues for the rest

## Quick Start

```bash
cd scripts/screenshot-pipeline
npm install

# First time: authenticate with Sentry (opens a browser)
npm run auth:setup

# Run the full pipeline
npm run crawl                  # discover stale assets
npm run capture                # screenshot + diff
npm run replace                # commit replacements + open PR
npm run create-issues          # create Linear issues for manual items

# Or run everything in sequence
npm run pipeline
```

## For Docs Writers

### `sentry_ui_url` frontmatter field

Docs pages with screenshots of the Sentry UI need a `sentry_ui_url` field in their frontmatter:

```yaml
---
title: Your Page Title
description: Page description.
sentry_ui_url: https://sentry.io/organizations/{org}/your/page/path/
---
```

Use `{org}` as a placeholder -- the pipeline replaces it with the actual org slug at capture time.

**This field is added automatically.** When you open a PR that adds images to a docs page, a GitHub Actions workflow detects the missing field, infers the URL from the doc path, and commits it to your branch. You don't need to do anything.

If the auto-detected URL is wrong (e.g., your screenshots show a specific sub-page rather than the section landing page), just update the field manually -- the bot won't overwrite an existing value.

Pages that don't need `sentry_ui_url`:
- Pages with only code samples, architecture diagrams, or non-UI images
- Pages with only Arcade embeds (handled separately)
- Tutorial pages where screenshots show IDEs, terminals, or external tools

### Checking your screenshots locally

```bash
# Capture a specific image
npm run capture -- --asset docs/product/issues/img/issue-details.png

# Capture all images for a doc page
npm run capture -- --doc docs/product/issues/issue-details/index.mdx

# Preview without overwriting anything
npm run capture -- --dry-run
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm run auth:setup` | Open a browser to log in to Sentry and save the session |
| `npm run crawl` | Scan docs for stale screenshots and Arcade embeds |
| `npm run capture` | Capture fresh screenshots and compute diffs |
| `npm run replace` | Copy auto-replaceable screenshots and open a PR |
| `npm run create-issues` | Create Linear issues for items needing manual review |
| `npm run auto-map` | Auto-generate URL mappings from doc paths (for bulk setup) |
| `npm run inject-urls` | Inject `sentry_ui_url` into MDX frontmatter from auto-map output |
| `npm run generate-map` | Generate a template for `screenshot-map.yaml` |
| `npm run pipeline` | Run the full pipeline (crawl + capture + replace + create-issues) |

### CLI Flags

Most commands accept these flags:

- `--scope docs/product/issues` -- Limit to a specific directory
- `--dry-run` -- Preview changes without modifying files
- `--asset <path>` -- Target a specific image (capture only)
- `--doc <path>` -- Target all images in a specific doc (capture only)

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `UI_REFRESH_CUTOFF` | `2025-06-01` | Images last modified before this date are considered stale |
| `DIFF_THRESHOLD_LOW` | `0.01` (1%) | Below this diff % = unchanged, skip |
| `DIFF_THRESHOLD_HIGH` | `0.50` (50%) | Above this diff % = suspicious, flag for review |
| `SENTRY_ORG_SLUG` | `sentry` | Org slug for URL templating |
| `SENTRY_STORAGE_STATE_PATH` | `auth/storageState.json` | Path to Playwright auth state |
| `LINEAR_API_KEY` | -- | Linear API token (required for issue creation) |
| `LINEAR_TEAM_ID` | -- | Linear team ID for the DOCS team |
| `DRY_RUN` | `false` | Set to `true` to prevent any mutations |

### Config Files

- **`config/screenshot-map.yaml`** -- Override URL mappings and add element selectors, ignore regions, etc. Takes precedence over frontmatter for individual images.
- **`config/screenshot-config.yaml`** -- Flag images as annotated or skipped.

## Diff Thresholds

The pipeline uses three thresholds to classify screenshot diffs:

| Diff % | Deterministic Page | Result |
|--------|-------------------|--------|
| < 1% | either | `unchanged` -- skip |
| 1-50% | `true` | `auto_replace` -- goes into PR |
| 1-50% | `false` | `needs_review` -- Linear issue |
| > 50% | either | `needs_review` -- suspiciously large change |
| capture fails | either | `capture_failed` -- Linear issue |

Since we use a demo account with controlled data, most pages are marked `deterministic: true` and eligible for auto-replacement.

## Auth

The pipeline authenticates to Sentry using Playwright's storage state mechanism (saved cookies/session).

```bash
# Generate auth state (opens a browser, log in, then close it)
npm run auth:setup

# For CI: base64-encode and store as a GitHub secret
base64 -i auth/storageState.json | pbcopy
```

The auth state file is gitignored. When it expires, re-run `npm run auth:setup`.

## Architecture

See [TECH-SPEC.md](TECH-SPEC.md) for full technical details and [PRD.md](PRD.md) for product requirements.

```
scripts/screenshot-pipeline/
  src/
    crawl-inventory.ts        # Discovers stale assets
    capture-and-diff.ts       # Playwright capture + pixelmatch diff
    auto-replace.ts           # Commits replacements + opens PR
    create-linear-issues.ts   # Creates Linear tickets
    lib/
      types.ts                # Shared types + config loader
      auth.ts                 # Sentry auth helper
      diff.ts                 # pixelmatch wrapper
      image-optimizer.ts      # sharp-based PNG optimization
      linear-client.ts        # Linear API client
  tools/
    auto-map-urls.ts          # Bulk URL mapping from doc paths
    inject-frontmatter-urls.ts # Inject sentry_ui_url into MDX frontmatter
    generate-map-template.ts  # Generate screenshot-map.yaml template
  config/
    screenshot-map.yaml       # Per-image overrides
    screenshot-config.yaml    # Annotated image flags
  auth/
    storageState.json         # Playwright session (gitignored)
```
