# 404 Link Checker

This script checks all documentation pages for broken internal links (404s).

## Usage

```bash
# Basic usage (with deduplication - recommended)
bun ./scripts/lint-404s/main.ts

# Show progress for each page
bun ./scripts/lint-404s/main.ts --progress

# Skip deduplication and check all pages (for debugging)
bun ./scripts/lint-404s/main.ts --skip-deduplication

# Filter to a specific path
bun ./scripts/lint-404s/main.ts --path platforms/javascript
```

## Deduplication

By default, the checker **deduplicates common files** to improve performance.

### Why?

The Sentry docs use a "common" file system where documentation is shared across multiple platforms. For example:

- `/platforms/apple/common/configuration/index.mdx` is rendered as:
  - `/platforms/apple/guides/ios/configuration/`
  - `/platforms/apple/guides/macos/configuration/`
  - `/platforms/apple/guides/watchos/configuration/`
  - ... and many more

Without deduplication, the checker would fetch and test the same content dozens of times, which:

- Takes much longer to run
- Wastes CI resources
- Provides no additional value (the content is identical)

### How it works

1. The checker fetches a source map from `/api/source-map` that maps each slug to its source file
2. It tracks which source files have been checked
3. For common files, it only checks the first instance
4. **API-generated pages** are always checked (they have no source file)

This typically reduces the number of pages checked from **~9,000 to ~2,500**, a **72% reduction**.

### When to use `--skip-deduplication`

Use this flag to skip deduplication and verify that all rendered pages work correctly, even if they share the same source. This is rarely necessary but can help debug issues with:

- Path routing
- Platform-specific rendering bugs
- Edge cases in the build system

## Ignore List

The `ignore-list.txt` file contains paths that should be skipped during checking. Add paths here (one per line) if they're known to be inaccessible or are special cases.

## Exit Codes

- `0` - No 404s found
- `1` - 404s were detected

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

1. **Performance**: External link checking is slower and shouldn't block PRs
2. **False positives**: Many external sites block automated checkers
3. **Different scope**: External checks only run on changed files in PRs; internal checks validate all pages
