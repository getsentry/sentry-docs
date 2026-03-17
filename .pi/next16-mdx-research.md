# Next.js 16 Migration: MDX Pipeline Research

**Date:** 2026-03-16
**Branch:** `sdybskiy/next16-mdx-research`
**Status:** Research only — no code changes committed

Full research artifacts: `~/.pi/history/sentry-docs/research/2026-03-16-*`

---

## Current Architecture

### MDX Pipeline (src/mdx.ts)
1. `getFileBySlug(slug)` reads an MDX file from disk
2. `bundleMDX()` from `mdx-bundler` compiles it:
   - Passes through 12 remark plugins + 6 rehype plugins
   - Uses **esbuild** internally as a module bundler
   - esbuild handles image file copying via its `file` loader (`remarkMdxImages` rewrites `![](./img/foo.png)` → `import __0__ from './img/foo.png'`)
   - Output: IIFE string that `new Function()` can evaluate
3. Results are brotli-compressed and cached in `.next/cache/mdx-bundler/`
4. `getMDXComponent(code)` (src/getMDXComponent.ts) evaluates the code string via `new Function()` with React/ReactDOM/jsx_runtime in scope

### Key facts verified by code analysis:
- **2,180 MDX/MD files** in `docs/`, expanding to **~9,400 pages** via platform × guide matrix
- Only **2 MDX files** have actual `import` statements outside code fences (changelog.mdx imports a React component, components.mdx has a false positive)
- **326 MDX files** reference relative images (`![](./img/...)`)
- **2,392 import statements** exist inside code fences — these are example code, not MDX imports
- esbuild is used solely for image file copying — the MDX content doesn't import npm packages or local modules

### Static Generation
- `app/[[...path]]/page.tsx` uses `generateStaticParams()` to enumerate all ~9,400 pages
- `dynamicParams = false` + `dynamic = 'force-static'` — pure SSG, no runtime rendering
- Runtime MDX compilation is explicitly blocked on Vercel (throws `MDX_RUNTIME_ERROR`)

### Versions
- Next.js: 15.5.12
- mdx-bundler: 10.1.1
- @mdx-js/mdx: 3.1.1 (already installed as transitive dep)

---

## Problem 1: mdx-bundler + Turbopack Incompatibility

**Next.js 16 makes Turbopack the default bundler** for both `next dev` and `next build`.

mdx-bundler is architecturally incompatible with Turbopack:

1. **`serverExternalPackages` is silently ignored by Turbopack** — Turbopack tries to bundle esbuild's native binary, which is impossible
2. **esbuild uses dynamic `require()` for platform-specific packages** (`@esbuild/darwin-arm64`, etc.) that Turbopack can't statically trace

Errors you'd see:
```
Error: Cannot find module '@esbuild/darwin-arm64'
Error [ERR_REQUIRE_ESM]: require() of ES Module .../mdx-bundler/dist/index.js
```

**Relevant issues:**
- mdx-bundler [#216](https://github.com/kentcdodds/mdx-bundler/issues/216) — Turbopack incompatibility
- vercel/next.js [#54393](https://github.com/vercel/next.js/issues/54393) — `serverExternalPackages` ignored by Turbopack

**Immediate workaround:** `next build --webpack` opts back to webpack. This unblocks upgrading to v16 without changing the MDX pipeline.

---

## Problem 2: Deployment Size (37,780 files / 3.8GB)

### What changed in Next.js 16

Next.js 15 (webpack) produces **2–3 files per route**:
```
page.html, page.rsc, page.js
```

Next.js 16 (Turbopack) produces **5–7 files per route** (for incremental prefetching / layout dedup):
```
.segments/__PAGE__/{.__full.txt, .__head.txt, .__tree.txt, .__index.txt, .__PAGE__.txt}
page.html, page.js, page_client-ref.js
```

At 9,400 pages this multiplies into tens of thousands of extra files.

**Known data duplication bug** in v16.0–v16.1: large page data appears in both `.__full.txt` and `.__PAGE__.txt`. Fix targeted for v16.2.

**Vercel limits** (not the 75MB cited):
- Source files: 15,000 (hard limit, pre-build)
- Serverless function: 250 MB unzipped
- Build timeout: 45 min
- Main constraint is I/O and build time at this scale

### Solutions (can combine)

| Strategy | Size Reduction | Effort |
|----------|---------------|--------|
| `next build --webpack` | ~50% (restores v15 file format) | Trivial (1 flag) |
| Hybrid ISR (prerender top ~500 pages) | ~95% | Medium |
| Wait for v16.2 duplication fix | ~30–40% | None |

---

## Problem 3: Replacing mdx-bundler

### Why mdx-bundler exists

mdx-bundler wraps `@mdx-js/mdx` and adds esbuild as a full module bundler on top. Its value is resolving `import` statements inside MDX files.

### Why we don't need it

Verified: **sentry-docs MDX content doesn't import npm packages or local modules**. The only thing esbuild does is copy images via its `file` loader (triggered by `remarkMdxImages`).

### Drop-in replacement: `@mdx-js/mdx` compile() directly

Already installed (`@mdx-js/mdx@3.1.1`). Tested and confirmed working:

```ts
import {compile} from '@mdx-js/mdx';

const result = await compile(source, {
  outputFormat: 'function-body',
  remarkPlugins: [/* all existing plugins */],
  rehypePlugins: [/* all existing plugins */],
});
const code = String(result);
```

**Output format difference:**
- mdx-bundler: IIFE that accesses `_jsx_runtime` by name in scope
- @mdx-js/mdx function-body: uses `arguments[0]` for jsx runtime

**getMDXComponent.ts change needed:**
```ts
// Current (mdx-bundler output):
const scope = {React, ReactDOM, _jsx_runtime: jsxRuntime, ...globals};
const fn = new Function(...Object.keys(scope), code);
return fn(...Object.values(scope));

// New (@mdx-js/mdx function-body output):
const fn = new Function(code);
return fn(jsxRuntime);  // arguments[0] = jsx runtime
```

Verified: renders correct HTML. Passing React as `arguments[0]` (current pattern) fails with `_jsx is not a function`.

### Image handling replacement

Need a pure remark plugin to replace `remarkMdxImages` + esbuild file loader:

```ts
// Conceptual: remark plugin that copies images and rewrites URLs
function remarkCopyImages({sourceFolder, outdir}) {
  return (tree) => {
    visit(tree, 'image', (node) => {
      if (node.url.startsWith('./') || node.url.startsWith('../')) {
        const srcPath = path.resolve(sourceFolder, node.url);
        const hash = md5(fs.readFileSync(srcPath));
        const destName = `${hash}${path.extname(node.url)}`;
        fs.copyFileSync(srcPath, path.join(outdir, destName));
        node.url = `/mdx-images/${destName}`;
      }
    });
  };
}
```

This replaces the `remarkMdxImages` → esbuild file loader pipeline. ~50 lines of code.

### What gets eliminated
- `mdx-bundler` dependency
- `esbuild` dependency (only used by mdx-bundler)
- `ESBUILD_BINARY_PATH` workaround
- `esbuild write=false` Lambda workaround
- `outputFileTracingExcludes` for esbuild binaries
- `serverExternalPackages` for esbuild
- The entire Turbopack incompatibility

### What stays the same
- All 12 remark plugins + 6 rehype plugins (identical API)
- Brotli disk cache layer
- `new Function()` execution pattern
- `getMDXComponent.ts` (with small adjustment)
- The `getFileBySlug` / `getFileBySlugWithCache` structure

### apiPage/index.tsx also uses bundleMDX
The `parseMarkdown()` function in `src/components/apiPage/index.tsx` uses `bundleMDX` for parsing API descriptions. Same replacement applies — no imports in that content.

### Estimated effort: 1–2 days

---

---

## What Turbopack Actually Requires: Complete Changelist

### MUST DO — Blockers (5 items, ~2 days)

#### 1. Replace `bundleMDX()` → `compile()` in `src/mdx.ts`

**Current:** `bundleMDX({ source, cwd, mdxOptions, esbuildOptions })` from `mdx-bundler`
**New:** `compile(source, { outputFormat: 'function-body', remarkPlugins, rehypePlugins })` from `@mdx-js/mdx`

Key differences:
- No `cwd` param needed (not resolving imports)
- No `esbuildOptions` (no esbuild)
- `outputFormat: 'function-body'` produces `new Function()`-compatible code
- Returns `{ value: string }` instead of `{ code: string }`
- Frontmatter extraction: `bundleMDX` returns `{ frontmatter }` via `gray-matter`. With `@mdx-js/mdx`, frontmatter is already extracted earlier by `remarkExtractFrontmatter` — just need to capture it differently.

#### 2. Write `remark-copy-images` plugin (new file, ~60 lines)

Replaces `remarkMdxImages` + esbuild file loader. The plugin:
- Visits `image` AST nodes with relative paths (`./img/foo.png`)
- Copies the file to `public/mdx-images/` with content-hashed name (`foo-ABCD1234.png`)
- Rewrites `node.url` to `./foo-ABCD1234.png` (keeping `?v=hash#WxH` from `remarkImageProcessing`)
- `DocImage` component already handles `./` prefix → `/mdx-images/` resolution

This also eliminates:
- 423 orphaned `_mdx_bundler_entry_point-*.js` files in `public/mdx-images/`
- The `assetsCacheDir` → `outdir` copy logic in `getFileBySlug`

#### 3. Update `src/remark-image-resize.js`

**Current:** Operates on `mdxJsxTextElement` nodes (output of `remarkMdxImages`)
**New:** Also handle regular `image` AST nodes (since we're dropping `remarkMdxImages`)

74 MDX files use `![Alt =300x200](img.png)` syntax.

#### 4. Update `src/getMDXComponent.ts`

**Current:** `new Function(...Object.keys(scope), code)(...Object.values(scope))` where scope = `{React, ReactDOM, _jsx_runtime: jsxRuntime}`
**New:** `new Function(code)(jsxRuntime)` — `function-body` output uses `arguments[0]` for jsx runtime

Verified: current pattern fails with `_jsx is not a function` on `@mdx-js/mdx` output.

#### 5. Update `src/components/apiPage/index.tsx` `parseMarkdown()`

Same change as #1 — replace `bundleMDX()` with `compile()`. This is simpler since API descriptions don't have images.

### SHOULD DO — Cleanup (3 items, ~30 min)

#### 6. Handle `@codecov/nextjs-webpack-plugin`

The `webpack()` config callback in `next.config.ts` only contains the Codecov plugin. Options:
- Make conditional: `webpack: process.env.TURBOPACK ? undefined : (config) => {...}`
- Or just remove — it's for bundle analysis, not critical
- No Turbopack-compatible Codecov plugin exists yet

#### 7. Clean up `serverExternalPackages` in `next.config.ts`

Remove all esbuild entries:
```diff
  serverExternalPackages: [
    'rehype-preset-minify',
-   'esbuild',
-   '@esbuild/darwin-arm64',
-   '@esbuild/darwin-x64',
-   '@esbuild/linux-arm64',
-   '@esbuild/linux-x64',
-   '@esbuild/win32-x64',
-   // mdx-bundler fully excluded via outputFileTracingExcludes
    'sharp',
    ...
  ],
```

Also investigate: `@aws-sdk/client-s3`, `@google-cloud/storage`, `prettier`, `mermaid` are in the list but:
- `@aws-sdk` is only used in `scripts/generate-md-exports.mjs` (not in the Next.js app)
- `@google-cloud/storage` is not imported anywhere — likely a leftover
- `prettier` is not imported in app code
- `mermaid` is a `'use client'` component with dynamic import — doesn't need `serverExternalPackages`

#### 8. Clean up `outputFileTracingExcludes` in `next.config.ts`

Remove esbuild and mdx-bundler entries:
```diff
  'node_modules/@esbuild/**/*',
  'node_modules/esbuild/**/*',
  ...
  'node_modules/mdx-bundler/**/*',
```

### ALREADY COMPATIBLE — No changes needed

- **`@sentry/nextjs` v10** — Has explicit Turbopack support (`getFinalConfigObjectBundlerUtils`, `handleRunAfterProductionCompile` for turbopack)
- **`sharp`** — Used by Next.js image optimization internally, handled by Turbopack
- **`mermaid`** — Client-side dynamic import, works with Turbopack
- **`outputFileTracingIncludes`** — For Vercel serverless function bundling, handled at deploy level
- **All remark/rehype plugins** — Run as Node.js code inside server functions, transparent to Turbopack

### Package.json changes

```diff
  dependencies:
-   "esbuild": "^0.25.0",
-   "mdx-bundler": "^10.0.1",
-   "remark-mdx-images": "^3.0.0",
    # @mdx-js/mdx already installed as transitive dep, make it direct:
+   "@mdx-js/mdx": "^3.1.1",
```

Note: `esbuild` is still needed as a **dev tool** for `generate-doctree` script (`esbuild scripts/generate-doctree.ts --bundle`), but can be moved to `devDependencies`.

---

## mdxRs (Rust-based MDX compiler)

**❌ Not viable for sentry-docs.** Three independent blockers:

1. **No plugin support** — `mdxjs-rs` explicitly doesn't support remark/rehype plugins. All 18 custom plugins would be silently ignored.
2. **Loader-only architecture** — No programmatic API. Can't be called from `getFileBySlug()` → can't support cache → `new Function()` pipeline.
3. **Still experimental** — Since Next.js 13.2 (2023), still not production-ready.

Even with Turbopack's non-mdxRs path (`@mdx-js/loader`), plugins with function-valued options (like `remarkVariables` with its `resolveScopeData: async () => ...`) can't be serialized for Turbopack. This rules out loader-based approaches entirely.

**Bottom line:** mdxRs is designed for simple MDX-as-pages setups. Sentry-docs' programmatic pipeline is a fundamentally different architecture.

---

## Alternatives Considered

| Alternative | Fit | Notes |
|------------|-----|-------|
| **@mdx-js/mdx direct** | ⭐ Best | Drop-in, already installed, no esbuild |
| **mdxRs** | ❌ | No plugins, no programmatic API, experimental |
| **next-mdx-remote/rsc** | OK | Clean RSC API but opinionated — compile+render coupled, no cache separation |
| **@next/mdx** | ❌ | Webpack loader — can't handle virtual page expansion, programmatic API |
| **Velite** | ❌ | Collection-based — can't express common/ → platform × guide matrix |
| **contentlayer2** | ❌ | Abandoned upstream, fragmented fork |

---

## Recommended Migration Path

### Phase 1: Upgrade to Next.js 16 (low risk)

1. Add `--webpack` flag to `next build` in package.json
2. Run the automated codemod: `npx @next/codemod@canary upgrade latest`
3. Fix async request API changes (v16 removes sync access completely)
4. Replace `next lint` with direct `eslint` (removed from CLI)
5. Add `default.js` to any parallel route slots

**Result:** Running on Next.js 16 with webpack, same MDX pipeline. Deployment size unchanged from v15. md-exports + Algolia + R2 all work unchanged.

### Phase 2: Replace mdx-bundler with @mdx-js/mdx (medium effort)

1. Write pure remark image copy plugin (~50 lines)
2. Replace `bundleMDX()` calls with `compile()` from `@mdx-js/mdx`
3. Update `getMDXComponent.ts` to pass jsx runtime as `arguments[0]`
4. Update `apiPage/index.tsx` parseMarkdown
5. Remove esbuild, mdx-bundler deps
6. Clean up next.config.ts (remove esbuild from serverExternalPackages, outputFileTracingExcludes)

**Result:** Turbopack-compatible. Enables ISR (no esbuild binary needed at runtime). md-exports + Algolia still work unchanged (still full SSG at this point).

### Phase 3: Enable Turbopack (trivial after Phase 2)

Remove `--webpack` flag. Turbopack is default.

**Result:** Faster builds with Turbopack. BUT deployment size may increase due to Turbopack's per-route file format (5-7 files vs 2-3). Monitor this.

### Phase 4: Switch to hybrid ISR (high effort, high impact)

**⚠️ This is the hardest phase due to md-exports/Algolia coupling.**

ISR reduces deployment size but breaks the downstream pipeline:
- `generate-md-exports.mjs` reads `.next/server/app/*.html` — only exists for pre-rendered pages
- `scripts/algolia.ts` reads the same HTML files
- Both would miss ~8,500 ISR pages

**Three sub-tasks:**

**4a. Decouple content indexing from Next.js build**
- Build a standalone "content compiler" script that compiles ALL MDX → HTML using `@mdx-js/mdx` + React SSR (no Next.js needed)
- OR: keep a full SSG build as a separate CI job for content indexing, independent of the deploy build

**4b. Switch the deploy build to ISR**
```ts
export async function generateStaticParams() {
  const docs = await getDocsFrontMatter();
  // Pre-render: non-platform + platform depth≤3 + guide indexes = ~1,100 pages
  return docs
    .filter(d => !isDeepPlatformPage(d.slug))
    .map(d => ({ path: d.slug.split('/') }));
}
export const dynamicParams = true;
export const revalidate = 3600;
```

**4c. Add revalidation infrastructure**
- `/api/revalidate` route handler
- GitHub Actions webhook on merge to `main`
- Post-deploy cache pre-warming script (optional)

**4d. Remove the `MDX_RUNTIME_ERROR` guard** in `getFileBySlug` — ISR requires runtime MDX compilation on Vercel.

**Result:** ~90% smaller deployment artifact. Fast deploys. But requires significant refactoring of the content pipeline.

### Revised ordering

**Phase 1 → Phase 2 → Phase 3 → (evaluate) → maybe Phase 4**

Phase 4 (ISR) is the highest effort and may not be needed if Phase 1-3 solve the deployment size problem (webpack flag keeps v15-style output). **Recommend evaluating deployment size after Phase 3 before committing to Phase 4.**

### Current build output stats (v15 webpack, for reference)

```
.next/server/app/  — 5.1 GB total, 28,814 files
  9,594 .html  — 1.0 GB (avg 110 KB/page)
  9,594 .rsc   — 618 MB (avg 66 KB/page) 
  9,596 .meta  — 12 MB
  14 .js, 7 .json, 7 .map
Total .next/   — 6.3 GB
```

With Turbopack (v16 default), expect this to roughly double. With `--webpack` flag, stays the same.

---

## Key Risks

| Risk | Mitigation |
|------|-----------|
| @mdx-js/mdx compile output differs from mdx-bundler | Tested — works with `outputFormat: 'function-body'`, small getMDXComponent change |
| Image handling regression | Existing images have tests, can validate with build diff |
| ISR cold start latency (500ms–3s first request) | Cache pre-warming script, revalidate TTL as safety net |
| Some remark plugin incompatibility | All plugins use standard unified/remark API — same with both mdx-bundler and @mdx-js/mdx |
| changelog.mdx imports a React component (`DocsChangelog`) | Only 1 file — can be handled specially (import at page level, pass as component prop) |

---

## R2 / Search / MCP Docs Infrastructure

### Critical dependency: md-exports + Algolia both read from `.next/server/app/*.html`

**Build pipeline:**
```
generate-og-images → generate-doctree → next build → generate-md-exports
                                          ↓                    ↓
                                   .next/server/app/*.html   public/md-exports/*.md + R2
```

**Algolia indexing** (separate CI job on push to master):
```
pnpm build → .next/server/app/*.html → algolia.ts → Algolia index
```

Both `generate-md-exports.mjs` and `scripts/algolia.ts` read the **static HTML output** from `next build`. With full SSG, all 9,400 HTML files exist. With ISR pre-rendering only ~500 pages, only ~500 HTML files would exist.

### ⚠️ ISR breaks md-exports + Algolia if done naively

If we switch to ISR and only pre-render 500 pages, ~9,100 pages would have NO `.html` file after build → md-exports and Algolia would miss them entirely.

### Solution: Decouple md-exports/Algolia from Next.js static output

**Option A: Keep full SSG build in CI, deploy with ISR config**
- CI runs `next build` with full SSG (all 9,400 pages) for md-exports + Algolia
- Deploy to Vercel with ISR config (only pre-renders subset)
- Problem: doesn't actually reduce CI build time

**Option B: Separate "content build" step** ⭐ Recommended
- New script: compile ALL MDX → HTML directly (using `@mdx-js/mdx` + React SSR, no Next.js)
- This replaces the current round-trip (MDX → Next.js HTML → markdown)
- md-exports + Algolia read from this independent content build
- Next.js build only pre-renders the subset needed for deployment
- Decouples content indexing from deployment

**Option C: Fetch-based approach for md-exports/Algolia**
- After ISR deploy, run a script that fetches all 9,400 URLs from the live site
- Each fetch triggers ISR rendering + caching
- Then scrape the live HTML for md-exports + Algolia
- Problem: slow (9,400 HTTP requests), depends on successful deploy first

**Option D: Build all pages but upload selectively to Vercel** ⭐ Simplest
- Keep full SSG build (all 9,400 pages get built)
- md-exports + Algolia work unchanged
- The deployment size problem is addressed by compressing/deduplicating the Vercel upload, OR
- Use `--webpack` flag to keep v15-style output (fewer files per route)
- ISR becomes a future optimization, not a requirement for v16

---

## ISR Pre-rendering Strategy

### Structural heuristic (no analytics needed)

| Category | Count | Description |
|----------|-------|-------------|
| Non-platform pages | 472 | product, org, concepts, guides, pricing, security, cli, ai, account, changelog |
| API pages | 242 | All API reference |
| Platform root pages | 22 | `platforms/javascript`, `platforms/python`, etc. |
| Platform direct children (depth ≤ 3) | 270 | `platforms/X/tracing`, `platforms/X/configuration`, etc. |
| Guide index pages | 93 | `platforms/X/guides/Y` |
| **Total pre-rendered** | **~1,100** | |
| **ISR on-demand** | **~8,500** | |

The ISR pages are almost entirely:
- **7,694 guide child pages** (`platforms/X/guides/Y/tracing/...`, `platforms/X/guides/Y/configuration/...`) — these are mostly duplicates of the platform `common/` content
- **854 deep platform pages** (depth 4+ like `platforms/X/tracing/instrumentation/custom-instrumentation`)

### ISR doesn't reduce what gets BUILT — it reduces what gets DEPLOYED

With ISR, `next build` still only generates HTML for the pre-rendered subset. The rest are generated on first request. This means:
- ✅ Deployment artifact: small (only ~1,100 pages)
- ✅ Deploy time: fast
- ❌ Build time: still need full compilation for md-exports + Algolia (separate step)
- ❌ First-request latency: 500ms–3s for ISR pages (cold start)

---

## Open Questions

1. **Build cache persistence** — The brotli MDX cache in `.next/cache/mdx-bundler/` — does Vercel persist this between deploys? If switching to ISR, compiled MDX would need to be cached differently (Vercel Data Cache).
2. **Developer experience** — With ISR, local `pnpm dev` already compiles on-demand. But the `MDX_RUNTIME_ERROR` guard in `getFileBySlug` must be removed for ISR to work on Vercel.
3. **changelog.mdx** — The one MDX file that imports a React component (`DocsChangelog`). Needs special handling — either pass as component prop or compile separately.
4. **Can we keep full SSG + `--webpack` as the v16 path?** — If the deployment size is acceptable with webpack (v15-style output), this is by far the simplest approach. ISR becomes a future optimization, not a blocker.
