# 404 Link Checker

This script checks all documentation pages for broken internal links (404s).

## Usage

```bash
# Default: expand platform common multi-renders (recommended)
pnpm exec tsx ./scripts/lint-404s/main.ts

# Show progress for each page
pnpm exec tsx ./scripts/lint-404s/main.ts --progress

# Legacy unique-source mode (one page per source file; misses guide-specific PlatformLink 404s)
pnpm exec tsx ./scripts/lint-404s/main.ts --unique-source

# Check every sitemap page (no source deduplication)
pnpm exec tsx ./scripts/lint-404s/main.ts --skip-deduplication
# alias:
pnpm exec tsx ./scripts/lint-404s/main.ts --all-pages

# Tune page fetch concurrency (default 8)
pnpm exec tsx ./scripts/lint-404s/main.ts --concurrency 12

# Filter to a specific path
pnpm exec tsx ./scripts/lint-404s/main.ts --path platforms/javascript
```

## Deduplication modes

### Why not always check every URL?

The Sentry docs use a "common" file system where documentation is shared across multiple platforms. For example:

- `/platforms/apple/common/configuration/index.mdx` is rendered as:
  - `/platforms/apple/guides/ios/configuration/`
  - `/platforms/apple/guides/macos/configuration/`
  - `/platforms/apple/guides/watchos/configuration/`
  - ... and many more

Historically the checker used **unique-source** mode: only the first sitemap slug for each source file was crawled. That cut the work from ~10k pages to ~2.5k (~72%), but it was **not** the same coverage.

### The blind spot

Shared `*/common/*` pages often include `PlatformSection` / `PlatformLink`. Those resolve differently per guide, so the first render can be healthy while a later guide links to a sibling page that is not in that guide's `supported:` list (404).

Unique-source mode only sees the first guide, so those 404s never fail CI.

### Default: `expand-common`

1. Fetch `/api/source-map` (slug → source file)
2. For sources under a platform `common/` tree, check **every** rendered slug
3. For other shared sources, still check only the first slug
4. Always check API-generated pages (no source file)

This catches guide-specific common-page 404s while still skipping true duplicates outside platform common trees.

On current docs scale this is close to full-site crawl cost for the link-check step, because most multi-renders come from platform common files. Page concurrency (default 8) keeps wall time practical.

### `--unique-source`

Old default. Fastest. Use only when you intentionally accept the PlatformLink blind spot.

### `--skip-deduplication` / `--all-pages`

Check every sitemap URL. Useful for debugging path routing or proving expand-common parity.

## Timing (observed)

From recent `Lint Docs for 404s` CI on `master` (unique-source):

| Phase                                      | ~Duration      |
| ------------------------------------------ | -------------- |
| install + full `pnpm build`                | ~12 min        |
| link check (~2475 pages, sequential pages) | ~1.0–1.1 min   |
| **job total**                              | **~14–15 min** |

Rough expectations after this change (link-check step only; build unchanged):

| Mode                            | Pages (approx) | Link-check wall time (approx)                 |
| ------------------------------- | -------------- | --------------------------------------------- |
| `--unique-source` (old default) | ~2.5k          | ~1 min sequential / lower with concurrency    |
| `expand-common` (new default)   | ~9–10k         | ~3–5 min at concurrency 8 (depends on runner) |
| `--all-pages`                   | ~10k           | similar to expand-common today                |

Build still dominates the workflow. A closed attempt to lighten the build for this job: [#18883](https://github.com/getsentry/sentry-docs/pull/18883).

## Ignore List

The `ignore-list.txt` file contains paths that should be skipped during checking. Add paths here (one per line) if they're known to be inaccessible or are special cases.

## Exit Codes

- `0` - No 404s found
- `1` - 404s were detected

## Tests

```bash
pnpm exec vitest run scripts/lint-404s/dedupe.test.ts
```

## External Link Checking

This script only checks **internal links**. External links (to third-party sites) are validated separately using [lychee](https://github.com/lycheeverse/lychee).

### Running Locally

```bash
# Install lychee
brew install lychee

# Check all markdown files in the repo
lychee .

# Check a specific file
lychee docs/platforms/javascript/index.mdx
```

### Pre-commit Hook

A pre-commit hook checks external links in changed files (warn-only, won't block commits). Requires lychee to be installed locally.

### CI Workflow

The GitHub workflow (`.github/workflows/lint-external-links.yml`) runs:

- Weekly on a schedule (creates/updates issue with broken links)
- On PRs (checks changed files only)
- Manually via workflow dispatch

### Configuration Files

- `lychee.toml` - Lychee configuration
- `.lycheeignore` - URLs to ignore during checking

### Why Separate from Internal Link Checking?

1. **False positives**: Many external sites block automated checkers
2. **Different scope**: External checks only run on changed files in PRs; internal checks validate all pages
