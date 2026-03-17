Research written to `research.md`. Here's the executive summary:

---

## Key findings

### 1. `output: 'standalone'` on Vercel = complete no-op
Vercel's `@vercel/next` adapter reads `.next/` manifests directly and **never touches `.next/standalone/`**. The deployment works identically with or without the setting — standalone output is just wasted build time. Vercel uses its own `minimalMode: true` internally, which is fundamentally different from standalone mode.

### 2. The "80 MB limit" is the **serverless function bundle limit**
Not the total deploy payload. The actual limits:
- **250 MB uncompressed** per serverless function (all plans — no documented way to increase via plan upgrade)
- **~50 MB compressed** — this is probably the "80 MB" you've encountered in practice
- **1 GB source upload** on Pro (irrelevant here — build happens on Vercel)

Upgrading to Enterprise lets you negotiate custom limits, but the 250 MB function bundle limit appears to be a hard platform constraint.

### 3. The real problem and the real fix
The `[[...path]]` function bundle is **455 MB** because `outputFileTracingExcludes` is missing exclusions that **the `sitemap.xml` route already has correctly**:

| Files in bundle incorrectly | Size |
|---|---|
| `public/mdx-images/` | 363 MB |
| `public/md-exports/` | 50 MB |
| PDFs | 12 MB |

**Add these three globs to the `[[...path]]` entry in `outputFileTracingExcludes`** → bundle drops from 455 MB to ~35 MB. Same fix needed for `platform-redirect`.

### 4. Don't use `output: 'standalone'` or `output: 'export'`
- Standalone: no-op on Vercel; would break ISR, edge middleware, per-route splitting if it ever worked
- Export: breaks API routes, rewrites (`/:path*.md`), `sitemap.xml` handler, `platform-redirect`

### 5. Bonus: `experimental.flyingShuttle`
Worth enabling — Next.js 15 incremental builds that only re-render changed pages. Won't fix bundle size but will dramatically speed up CI builds for a 9,400-page site.