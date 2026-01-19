# LLM Markdown Serving

This document describes how Sentry Docs serves markdown content to LLM/AI clients.

## Overview

When a client requests documentation with `Accept: text/markdown` header, they receive markdown content instead of HTML. This enables LLMs to consume documentation in a structured format without parsing HTML.

## Content Negotiation

The middleware (`src/middleware.ts`) detects markdown requests via:

1. **Accept header**: `text/markdown`, `text/x-markdown`, or `text/plain`
2. **User-Agent detection**: Known AI tools (Claude, Cursor, Copilot, ChatGPT, etc.)
3. **Manual override**: `?format=md` query parameter

When detected, the request is **rewritten** (not redirected) to serve markdown at the same URL.

## Markdown Generation

At build time, `scripts/generate-md-exports.mjs` converts HTML pages to markdown:

1. Parses HTML from `.next/server/app/*.html`
2. Converts to markdown using rehype-remark
3. Outputs to `public/md-exports/`
4. Uploads to Cloudflare R2 for CDN distribution

## Hierarchical Sitemaps

Each index page includes navigation links to help LLMs discover content:

### Root index.md (`/`)

- Sentry product overview and key features
- Links to top-level sections (platforms, api, product, etc.)
- Quick links to most useful documentation

### Section index pages (e.g., `/platforms/`)

Lists direct child pages under "Pages in this section".

### Platform index pages (e.g., `/platforms/javascript/`)

- **Guides section**: Framework-specific guides (React, Vue, Next.js, etc.)
- **Pages section**: Other direct children (configuration, tracing, etc.)

### Guide index pages (e.g., `/platforms/javascript/guides/react/`)

Lists direct child pages only (no separate Guides section since these aren't meta-guides).

### Nested pages (e.g., `/platforms/javascript/guides/react/tracing/`)

Lists their direct children under "Pages in this section".

## File Structure

```
public/md-exports/
├── index.md                          # Root sitemap with Sentry overview
├── platforms.md                      # Lists all platforms
├── platforms/
│   ├── javascript.md                 # Guides + Pages sections
│   ├── javascript/
│   │   ├── configuration.md
│   │   ├── guides/
│   │   │   ├── react.md              # Pages section only
│   │   │   └── react/
│   │   │       ├── configuration.md
│   │   │       └── tracing.md        # Pages section for children
│   └── python.md                     # Pages section only (no guides)
├── api.md                            # Pages section
└── product.md                        # Pages section
```

## Testing

```bash
# Request markdown content
curl -H "Accept: text/markdown" https://docs.sentry.io/platforms/python/

# View root sitemap
curl -H "Accept: text/markdown" https://docs.sentry.io/

# Force markdown via query param
curl "https://docs.sentry.io/platforms/python/?format=md"
```

## Configuration

Environment variables:

- `NEXT_PUBLIC_DEVELOPER_DOCS`: When set, uses `develop.sentry.dev` as the docs origin
- `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY`: For uploading to Cloudflare R2
