# Next.js 16 Research: Breaking Changes, Static Generation, Turbopack, Caching, MDX

**Research Date:** 2026-03-16  
**Sources:** GitHub Releases API (vercel/next.js), nextjs.org/blog/next-16, nextjs.org/docs/app/building-your-application/upgrading/version-16

---

## Release Status

| Version | Status | Date |
|---------|--------|------|
| v16.0.0 | **STABLE** | 2025-10-22 |
| v16.1.6 | **Latest stable** | 2026-01-27 |
| v16.2.0-canary.100 | Canary | 2026-03-15 |
| v15.5.12 | Stable (maintained) | 2026-02-04 |

**Next.js 16 is fully stable and released (not beta).** v15.x is still actively maintained in parallel. The canary track for v16.2.0 is for the next minor release.

---

## 1. ALL Breaking Changes: v15 → v16

### Runtime / Minimum Requirements
- **Node.js 20.9.0+** required (was 18.x). Node.js 18 no longer supported.
- **TypeScript 5.1.0+** required (was 5.0)
- **Browsers:** Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+

### Async Request APIs (Biggest Breaking Change)
v15 introduced these as breaking with temporary sync compatibility shims. v16 **removes all sync access**:
- `cookies()` — async only
- `headers()` — async only
- `draftMode()` — async only
- `params` in `layout.js`, `page.js`, `route.js`, `default.js`, OG image generators — now `Promise`
- `searchParams` in `page.js` — now `Promise`
- `id` param in sitemap function — now `Promise<string>`
- OG image `id` param from `generateImageMetadata` — now `Promise<string>`

**Migration:** `npx @next/codemod@canary upgrade latest` or `npx next typegen` to generate typed helpers (`PageProps`, `LayoutProps`, `RouteContext`).

### Turbopack Default (see section 3)

### PPR / Cache Components Overhaul
- `experimental.ppr` flag **removed**
- `experimental_ppr` route segment config **removed**
- `experimental.dynamicIO` flag **removed** — replaced by top-level `cacheComponents: true`
- Old PPR (Next.js 15 canary) behavior is **not compatible** with v16 Cache Components — stay on v15 canary if using PPR today

### Middleware → Proxy Rename
- `middleware.ts` deprecated, renamed to `proxy.ts`
- Exported function `middleware` deprecated, renamed to `proxy`
- `proxy.ts` runs **Node.js runtime only** (not Edge). For Edge, keep `middleware.ts`.
- Config flags renamed: `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`
- `onRequestError` context: `routeType: 'middleware'` → `routeType: 'proxy'`

### ESLint
- `@next/eslint-plugin-next` now defaults to **ESLint Flat Config** format
- `next lint` command **removed** — use `biome` or `eslint` CLI directly
- `next build` no longer runs linting
- `eslint` option in `next.config.js` removed
- `eslint-config-next` uses flat config by default

### Image (`next/image`) Breaking Changes
| Change | Old Default | New Default |
|--------|-------------|-------------|
| `images.minimumCacheTTL` | 60s | **14400s (4 hours)** |
| `images.imageSizes` | [16,32,48,64,96,128,256,384] | **[32,48,64,96,128,256,384]** (16 removed) |
| `images.qualities` | all allowed | **[75] only** |
| `images.maximumRedirects` | unlimited | **3** |
| Local images with query strings | allowed | **requires `images.localPatterns.search`** |
| `images.dangerouslyAllowLocalIP` | true | **false** (blocks local IP optimization) |

- `next/legacy/image` **deprecated**
- `images.domains` **deprecated** — use `images.remotePatterns`

### Removals
- **AMP support fully removed**: `useAmp`, `amp` config, `export const config = { amp: true }`
- **`serverRuntimeConfig` and `publicRuntimeConfig` removed** — use env vars + `NEXT_PUBLIC_` prefix
- **`unstable_rootParams` removed** (replacement API forthcoming)
- **`devIndicators` options removed**: `appIsrStatus`, `buildActivity`, `buildActivityPosition` (indicator still works)
- **AMP examples removed**

### Other Breaking Behavioral Changes
- **Scroll behavior**: Next.js no longer overrides `scroll-behavior: smooth` during navigation. To restore old behavior: `<html data-scroll-behavior="smooth">`
- **`next build` output removed metrics**: Size and First Load JS column removed from build output (inaccurate for RSC architectures)
- **`process.argv` check for `'dev'`**: Now returns `false` in next.config.js (config loads once, not twice). Check `NODE_ENV === 'development'` instead.
- **`next dev` isolation**: Dev outputs to `.next/dev` (not `.next/`) — see Section 4
- **Parallel routes `default.js` required**: All parallel route slots must have `default.js`. Builds fail without it.
- **`experimental.turbopack` moved** to top-level `turbopack` config

### Stabilized APIs (Removed `unstable_` Prefix)
- `unstable_cacheLife` → `cacheLife`
- `unstable_cacheTag` → `cacheTag`
- `cacheLife` config profiles in `next.config.ts` (no longer under `experimental`)
- `cacheHandlers` in `next.config.ts` (no longer under `experimental`)
- `reactCompiler` config (no longer under `experimental`)
- `turbopack` config (no longer under `experimental`)

### Sass
- `sass-loader` bumped to v16 (modern Sass API). Breaking if using legacy Sass features.
- Tilde `~` prefix for `node_modules` Sass imports **not supported** in Turbopack (remove `~`)

---

## 2. generateStaticParams and Static Generation

### No Major API Changes to `generateStaticParams` Itself
The function signature is **unchanged**. However, surrounding context changed:

**Bug fixes:**
- `Fix parallel routes ignoring generateStaticParams from primary route` (#84889)
- `Remove bailed out SSG routes from the list of SSG` (#83861) — routes that fail SSG no longer listed as static in build output

**Behavioral shift with `cacheComponents: true`:**
- When Cache Components is enabled, **all routes are dynamic by default**
- `generateStaticParams` still works to pre-render static routes at build time, but the caching model has changed
- Without `cacheComponents`, behavior is same as v15: routes with `generateStaticParams` build statically

**`dynamicIO` → `cacheComponents`:**
- If you used `experimental.dynamicIO: true` in v15, replace with `cacheComponents: true`
- This is the same underlying "dynamic by default" model — `generateStaticParams` works within it for pre-rendering, but data fetching inside pages must explicitly use `"use cache"` directive

**Async params in `generateStaticParams` context:**
- `params` in nested `generateStaticParams` (parent route params) follow the same async-params pattern from other APIs

---

## 3. Turbopack: Now the Default

**YES. Turbopack is stable and is now the default bundler.**

- Default for both `next dev` AND `next build`
- No `--turbopack` flag needed in package.json scripts:
  ```json
  // v15 required:
  "dev": "next dev --turbopack"
  
  // v16: just use:
  "dev": "next dev"
  ```
- **Opt out with `--webpack`** flag:
  ```json
  "build": "next build --webpack"
  ```
- If a custom webpack config exists but you run `next build` (Turbopack), build **fails** to prevent misconfiguration
- **>50% dev sessions and >20% prod builds** on 15.3+ were already on Turbopack before v16

### Turbopack Config Changes
```ts
// v15 — under experimental:
experimental: { turbopack: { ... } }

// v16 — top-level:
turbopack: { ... }
```

### New in v16 Turbopack
- **File System Caching (beta)**: `experimental.turbopackFileSystemCacheForDev: true` — caches artifacts on disk between dev restarts. Significant speedup for large repos.
- Debug IDs support
- Advanced webpack loader conditions
- `resolveAlias` for replacing `webpack.resolve.fallback`
- Tilde `~` imports in Sass **not supported** (remove or use `resolveAlias`)
- `.turbo` config object deprecated/removed

### Performance Claims
- 2–5× faster production builds vs webpack
- Up to 10× faster Fast Refresh

---

## 4. `.next/standalone` Output Changes

### Isolated Dev Build (New Behavior)
**Critical change:** `next dev` and `next build` now write to **separate output directories**:
- `next dev` → `.next/dev/`
- `next build` → `.next/` (unchanged)

This enables concurrent dev + build without conflicts (previously would race/corrupt). Controlled by `isolatedDevBuild` config.

**Impact on standalone:**
- `output: 'standalone'` output **still goes to `.next/standalone/`** — unchanged
- `server.js` in standalone output unchanged
- `cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/` pattern unchanged
- Turbopack tracing path changed: `.next/trace-turbopack` → `.next/dev/trace-turbopack`

### Lockfile Mechanism (New)
- Next.js acquires a lockfile on `distDir` during `next dev` and `next build`
- Prevents multiple simultaneous instances on the same project
- Acquired earlier in dev startup

### Build Output Changes
- `next build` output no longer shows **Size** and **First Load JS** columns (inaccurate for RSC)
- Added per-step timing: compile, TypeScript, page data collection, static generation, optimization
- `.next/trace-build` high-level trace file added

---

## 5. React 19 Features Affecting MDX Rendering

Next.js 16 ships with **React 19.2** (plus ongoing canary features).

### React 19.2 New Features
| Feature | Impact on MDX |
|---------|--------------|
| **View Transitions** | Animate MDX page transitions natively via `<ViewTransition>` inside React Transitions |
| **`useEffectEvent`** | Non-reactive Effect logic in MDX component islands |
| **`<Activity>`** | "Background activity" — hide MDX sections with `display: none` while maintaining state |

### React Compiler (Stable)
- First stable release. Opt-in via `reactCompiler: true` in next.config.ts.
- **Automatically memoizes** all components including MDX components and their wrappers.
- Could help large MDX page trees with many custom components (reduces re-renders).
- **Note:** Relies on Babel — adds compile time overhead. Not enabled by default.
- Install: `pnpm add -D babel-plugin-react-compiler`

### JSX Runtime Fix
- `Use correct JSX runtime for library-owned JSX in React Server` (#84869) — fixes edge cases where library-provided JSX (e.g., from MDX plugins) used wrong runtime in Server Components

### `mdxRs` Config Option
- `mdxRs` in `next.config.ts` still available (Rust-based MDX compiler, experimental)
- No new breaking changes to MDX configuration in v16

### Direct MDX Impact
- No breaking changes to `mdx-components.js` convention or MDX file processing itself
- MDX files continue to be processed as Server Components by default
- React 19.2 `<Activity>` could enable "lazy MDX sections" that maintain state when hidden

---

## 6. Caching Defaults Changed

### Fundamental Model Shift (When `cacheComponents: true`)
**The biggest philosophical change:** default is now fully **dynamic** (no implicit caching).

```ts
// v16 — opt into caching explicitly:
const nextConfig = {
  cacheComponents: true,  // replaces experimental.dynamicIO
}
```

With `cacheComponents: true`:
- All pages/layouts execute dynamically at request time by default
- `fetch()` calls are **not cached by default**
- Cache via `"use cache"` directive on functions, components, or pages
- `cacheLife()` and `cacheTag()` control cache lifetime and invalidation

Without `cacheComponents` (default v16 behavior): same as v15 stable behavior.

### New/Changed Caching APIs

**`revalidateTag(tag, profile?)` — updated signature**
```ts
// Old (still works but deprecated single-arg form):
revalidateTag('blog-posts')

// New — pass cacheLife profile for SWR:
revalidateTag('blog-posts', 'max')
revalidateTag('products', { expire: 3600 })
```

**`updateTag(tag)` — NEW (Server Actions only)**
```ts
import { updateTag } from 'next/cache'
// Expires cache AND immediately refreshes — read-your-writes semantics
updateTag(`user-${userId}`)
```

**`refresh()` — NEW (Server Actions only)**
```ts
import { refresh } from 'next/cache'
// Refreshes router/uncached data only — doesn't touch cache
refresh()
```

**`cacheLife` and `cacheTag` stabilized:**
```ts
// v15:
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache'

// v16:
import { cacheLife, cacheTag } from 'next/cache'
```

### Image Caching
- `images.minimumCacheTTL`: **60s → 4 hours** (14400s) — major change for image-heavy apps

### ISR / Static Caching
- `unstable_cache` still works but `"use cache"` directive + Cache Components is the recommended path
- `fetch` caching options still work in v15-compatible mode (without `cacheComponents`)

---

## 7. Migration Guides

### Official Resources
- **Upgrade guide**: https://nextjs.org/docs/app/building-your-application/upgrading/version-16
- **Blog post**: https://nextjs.org/blog/next-16
- **Codemods docs**: nextjs.org/docs/app/guides/upgrading/codemods

### Automated Codemod (Recommended)
```bash
npx @next/codemod@canary upgrade latest
```
Handles automatically:
- Update `experimental.turbopack` → top-level `turbopack`
- Migrate `next lint` → ESLint CLI
- Rename `middleware.ts` → `proxy.ts` + function rename
- Remove `unstable_` prefix from `cacheLife`, `cacheTag`
- Remove `experimental_ppr` route segment config
- Update middleware-related config flag names
- Update async params/searchParams usage

### Type Generation
```bash
npx next typegen
```
Generates `PageProps`, `LayoutProps`, `RouteContext` type helpers for safe async param migration.

### Manual Steps (Codemod Cannot Handle)
1. Node.js upgrade to 20.9+
2. TypeScript upgrade to 5.1+
3. Remove AMP-related code
4. Replace `serverRuntimeConfig`/`publicRuntimeConfig` with env vars
5. Update Sass tilde imports (`~bootstrap/...` → `bootstrap/...`)
6. Fix `next/legacy/image` → `next/image` (codemod available separately)
7. Review `images.minimumCacheTTL` if serving frequently-changing images
8. Add `default.js` to all parallel route slots
9. Update `devIndicators` options (`appIsrStatus`, etc. removed)
10. Review `scroll-behavior: smooth` CSS if used globally

### AI-Assisted Migration
```json
// .mcp.json — Next.js DevTools MCP for AI agents
{
  "mcpServers": {
    "next-devtools": {
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"]
    }
  }
}
```
Prompt: "Next Devtools, help me upgrade my Next.js app to version 16"

---

## Summary Table: Questions Answered

| Question | Answer |
|----------|--------|
| Release status | **Stable** — v16.1.6 (Jan 2026). v16.2.0-canary active. |
| Turbopack default? | **YES** — both dev and build. Use `--webpack` to opt out. |
| `generateStaticParams` changed? | No API changes. Bug fixes. Behavior shifts with `cacheComponents`. |
| `.next/standalone` changed? | Minor: dev now outputs to `.next/dev/`. Standalone itself unchanged. |
| React 19 MDX impact? | View Transitions, Activity, React Compiler (stable). No MDX API breaks. |
| Caching defaults? | Images: 60s→4h. With `cacheComponents`: dynamic-first, explicit `"use cache"`. |
| Migration guide? | Yes: nextjs.org/docs/.../upgrading/version-16 + `npx @next/codemod@canary upgrade latest` |

---

---

# Next.js 16 Deployment Size Issues on Vercel — Research

> Researched: 2026-03-16
> Scope: Next.js 16 deployment size, file explosion, Vercel limits, large static sites (10k+ pages)

---

## Table of Contents

1. [What Changed in Next.js 16 Output Format vs Next.js 15](#njs16-1-what-changed)
2. [Vercel Deployment Artifact Size & File Count Limits](#njs16-2-vercel-limits)
3. [How Large Sites (10k+ Pages) Are Handling This](#njs16-3-large-sites)
4. [GitHub Issues & Discussions — Deployment Size Explosion](#njs16-4-github-issues)
5. [Per-Route Files: `.next/server/app/` in v16 vs v15](#njs16-5-per-route-files)
6. [Workarounds Summary](#njs16-6-workarounds)
7. [Sources](#njs16-7-sources)

---

## 1. What Changed in Next.js 16 Output Format vs Next.js 15 {#njs16-1-what-changed}

### Release Timeline

- **Next.js 16.0** — Released **October 21, 2025** ([blog post](https://nextjs.org/blog/next-16))
- **Next.js 16.1** — Released **December 18, 2025** ([blog post](https://nextjs.org/blog/next-16-1))
- **Upgrade guide** — [nextjs.org/docs/app/guides/upgrading/version-16](https://nextjs.org/docs/app/guides/upgrading/version-16)

---

### 1.1 Turbopack Now Default (Key Driver of Build Output Changes)

The single biggest driver of changed output behaviour is **Turbopack becoming the default bundler** for both `next dev` and `next build`.

- In Next.js 15, Turbopack required `--turbopack` / `--turbo` opt-in.
- In Next.js 16, it runs unless you explicitly pass `--webpack`.

```json
// Next.js 16 — no flag needed:
{ "scripts": { "build": "next build" } }

// To opt back to Webpack:
{ "scripts": { "build": "next build --webpack" } }
```

Turbopack's output architecture differs from Webpack — it generates **granular segment-level artifacts** per route rather than coarser per-page files. This is the root cause of file count explosion.

> **Key quote from Next.js maintainers (Discussion #86320):**
> *"Next.js 16 separates pages into different building blocks, which means more files output."*

---

### 1.2 Enhanced Routing and Navigation — New Prefetch Architecture

Next.js 16 includes a **complete overhaul of the routing and navigation system**:

- **Layout deduplication**: A page with 50 product links downloads the shared layout once instead of 50 times. Dramatically reduces *transfer size* but requires granular per-segment artifacts at build time.
- **Incremental prefetching**: Next.js only prefetches parts not already in cache, rather than entire pages. The prefetch cache cancels requests when links leave the viewport and prioritizes on hover.

**Trade-off acknowledged by the team:** More individual prefetch *files* are generated at build time, but total *transfer size* is lower at runtime. This is an intentional trade-off.

---

### 1.3 Isolated Dev Builds — New `.next/dev` Directory

Next.js 16 introduces **`isolatedDevBuild`** (on by default):

- `next dev` now outputs to **`.next/dev/`** (separate from `.next/`)
- `next build` still outputs to `.next/`
- This nearly doubles the total `.next` folder size for developers who run both dev and build

Can be disabled:
```js
// next.config.js
const nextConfig = {
  isolatedDevBuild: false, // disables .next/dev separation
}
```

---

### 1.4 PPR / Cache Components — Replaced Prerender Config

**Partial Pre-Rendering (PPR) changes:**

| Feature | Next.js 15 | Next.js 16 |
|---------|-----------|-----------|
| PPR flag | `experimental.ppr: true` | **Removed** |
| Route-level PPR | `export const experimental_ppr = true` | **Removed** |
| New model | — | `cacheComponents: true` in `next.config.js` |
| Old flag | `experimental.dynamicIO: true` | Renamed → `cacheComponents: true` |

```js
// Next.js 16 — new way to enable PPR (now called "Cache Components"):
module.exports = { cacheComponents: true }

// Next.js 15 (still valid in 15 canary only):
module.exports = { experimental: { ppr: true } }
```

> ⚠️ **Warning from docs:** "PPR in Next.js 16 works differently than in Next.js 15 canaries. If you are using PPR today, stay in the current Next.js 15 canary you are using."

**How Cache Components changes prerender output:**
- A static HTML **shell** for the initial page load (served instantly)
- **RSC Payload** for client-side navigation
- **Suspense boundary fallbacks** baked into the static shell (dynamic content streams in at request time)

The static shell = all statically renderable content + Suspense boundary fallbacks for dynamic sections.

---

### 1.5 HTML Fallbacks and RSC Payloads

**RSC Payload** is a serialized representation of the React Server Component tree:
- Used by React on the client to reconcile/update the DOM on navigation
- Generated at build time for statically prerendered pages
- Previously called `index.rsc`, now named as `.txt` files (see Section 5)

**HTML fallbacks** work via Suspense boundaries:
- Parent component provides fallback UI in a `<Suspense>` boundary
- The fallback becomes part of the **static shell** (generated at build time)
- Actual dynamic content resolves/streams in at request time

---

### 1.6 Build Size Info Removed (Intentional Breaking Change)

In Next.js 15, `next build` output showed:
```
Route (app)          Size     First Load JS
├ ƒ /                3.46 kB  105 kB
├ ○ /_not-found      991 B    102 kB
```

In Next.js 16, this is **gone**:
```
Route (app)
├ ƒ /
├ ○ /_not-found
```

- **GitHub Issue #85712** — [next.js 16 lacks build size info](https://github.com/vercel/next.js/issues/85712)
- Status: **Closed as "not planned"** — intentional change per PR #83815
- Metrics were deemed inaccurate in RSC/server-driven architectures
- **Next.js 16.1** added an experimental [Bundle Analyzer](https://nextjs.org/docs/app/guides/package-bundling#nextjs-bundle-analyzer-experimental) as a replacement: `next experimental-analyze`

---

### 1.7 `middleware.ts` → `proxy.ts`

- `middleware.ts` deprecated, renamed to `proxy.ts`
- The `edge` runtime is NOT supported in `proxy.ts` (Node.js runtime only)
- Does not directly affect static output size

---

### 1.8 Concurrent Dev + Build, Turbopack Filesystem Cache

**Turbopack File System Caching:**
- Stores compiler artifacts on disk between runs (`.next/cache/`)
- **`next dev` caching**: Stable and **on by default** as of Next.js 16.1
- **`next build` caching**: Opt-in via `experimental.turbopackFileSystemCacheForBuild: true`
- This cache **must be excluded from deployment artifacts**

```ts
// next.config.ts
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,   // default in 16.1+
    turbopackFileSystemCacheForBuild: true, // opt-in
  },
}
```

**Next.js 16.1** also reduced npm package install size by ~20MB via simplifications in the Turbopack caching layer. (This is package size, not per-project `.next/` size.)

---

## 2. Vercel Deployment Artifact Size & File Count Limits {#njs16-2-vercel-limits}

**Source:** [vercel.com/docs/limits](https://vercel.com/docs/limits)

### 2.1 File Count Limits (Most Relevant for Static Sites)

| Limit | Value |
|-------|-------|
| **Max source files (CLI deploy)** | **15,000 files** — deployments exceeding this fail at the build step |
| Max build *output* files | **No hard upper limit** — but the 45-min build time limit is the de facto cap |
| Build time limit | **45 minutes** (Hobby and Pro) |

> ⚠️ **No 75MB deployment artifact limit** was found in current Vercel docs (March 2026).
> The **15,000 source file** limit applies to files uploaded via CLI *before* the build step.
> The **25MB limit** in some community posts refers to **Cloudflare Pages** edge bundle limits, not Vercel.

### 2.2 Deployment Size Limits (Source Uploads)

| Plan | Max Source File Upload (CLI) | Build Disk Size |
|------|------------------------------|-----------------|
| Hobby | 100 MB | 23 GB |
| Pro | 1 GB | 23 GB (up to 64 GB with larger build machines) |

### 2.3 Serverless Function Limits

| Limit | Value |
|-------|-------|
| Max unzipped function size | 250 MB (500 MB for Python) |
| Max request/response body | 4.5 MB |

### 2.4 Routes Per Deployment

| Plan | Limit |
|------|-------|
| Hobby | 2,048 routes |
| Pro | 2,048 routes |
| Enterprise | Custom |

### 2.5 Build Output File Scaling (Official Statement)

> *"Although there is no upper limit for output files created during a build, you can expect longer build times as a result of having many thousands of output files (100,000 or more, for example). If the build time exceeds 45 minutes then the build will fail."*

For large static sites, **the 45-minute build time limit is the effective constraint**, not a file count limit on build output.

**KB article:** [What can I do when I run into build output limits with Next.js on Vercel?](https://vercel.com/kb/guide/what-can-i-do-when-i-run-into-build-output-limits-with-next-js-on-vercel)

---

## 3. How Large Sites (10k+ Pages) Are Handling This {#njs16-3-large-sites}

### 3.1 Observed Impact at Scale

Real-world data from GitHub Discussion #86320:

| Site Scale | Next.js 15 `.next` size | Next.js 16 `.next` size | Change |
|------------|------------------------|------------------------|--------|
| ~11,000 SSG pages | 1.8 GB | 3.4 GB | ~1.9× |
| Unspecified large site | 3.5–3.64 GB | 6.3–6.37 GB | ~1.8× |
| 6,000 static pages | ~3 GB baseline | 6 GB+ | ~2× |

**Upload duration impact:** CI build & deploy decreased ~30% (7 min → 10 min) due to more files, even when total byte count was similar.

**~13,241 pages with `output: export`** — users report 30% slower CI, same pattern.

---

### 3.2 Strategy 1: ISR — Vercel's Primary Recommendation

Use ISR to pre-render only a subset of high-traffic pages and generate the rest on demand:

```js
// pages/[slug].js (Pages Router)
export async function getStaticPaths() {
  return {
    paths: [ /* only pre-render top N pages */ ],
    fallback: 'blocking', // or fallback: true for loading state
  }
}
```

```js
// app/[slug]/page.tsx (App Router)
export const revalidate = 3600 // revalidate every hour
```

Vercel explicitly recommends this for sites with >1,000 pages.

---

### 3.3 Strategy 2: Revert to Webpack

```json
{ "scripts": { "build": "next build --webpack" } }
```

Community-confirmed: one user reduced `.next` from 6 GB to 3 GB just by switching back. Turbopack v16.2+ may improve this — the team mentioned "Turbopack side-effect analysis improvements staged for v16.2."

---

### 3.4 Strategy 3: Disable Isolated Dev Builds

```js
// next.config.js
module.exports = { isolatedDevBuild: false }
```

Relevant only if `.next/dev` output is being inadvertently included in deployment artifacts.

---

### 3.5 Strategy 4: Migrate to Cloudflare via OpenNext

Some developers are migrating to Cloudflare Workers via **OpenNext**:

- [opennext.js.org/cloudflare](https://opennext.js.org/cloudflare)
- Transforms Next.js build output to run in Cloudflare Workers
- Supports ISR out of the box
- Note: The **25MB limit** in [this Medium post](https://medium.com/@Yasirgaji/migrating-next-js-16-from-vercel-to-cloudflare-overcoming-the-25mb-limit-aa88e8396b29) is a **Cloudflare Pages** limit — not Vercel
- Cloudflare now recommends OpenNext + Workers over Cloudflare Pages for Next.js

---

### 3.6 Strategy 5: Bundle Analyzer (16.1+)

```bash
next experimental-analyze
```

Interactive UI to inspect bundles, identify large modules, trace import chains across server-to-client boundaries.

---

### 3.7 Strategy 6: Power-Law Pre-Rendering

> *"For a site with 100,000 product pages, the power law means 90% of traffic usually goes to 50–200 pages. Those get pre-rendered in seconds. Everything else falls back to on-demand SSR and gets cached via ISR."*

Pre-render only highest-traffic pages statically; ISR everything else.

---

### 3.8 Strategy 7: Reduce Large Data Props (Addresses Duplication Bug)

A known v16 issue: large data from `page.tsx` is duplicated across `.__full.txt` and `.__PAGE__.txt`. Reducing the size of data passed to client components directly reduces per-route artifact size.

---

## 4. GitHub Issues & Discussions — Deployment Size Explosion {#njs16-4-github-issues}

### 4.1 Primary: `.next folder is bigger in Next.js 16`

**GitHub Discussion #86320**
🔗 [github.com/vercel/next.js/discussions/86320](https://github.com/vercel/next.js/discussions/86320)

- **Status:** Open / Active
- **Key data:**
  - `.next/server/app` grew 1.8 GB → 3.4 GB for 11,000 SSG pages
  - Single route: **7 artifacts** in v16 vs 2–3 in v15
  - Upload duration 3× longer even when total byte size was comparable
  - Data duplication: large page data in both `.__full.txt` and `.__PAGE__.txt`
- **Official response:** Expected behavior from architectural improvements; Turbopack side-effect analysis fix staged for v16.2
- **User workaround confirmed:** `--webpack` restores v15-comparable sizes

---

### 4.2 Build Size Info Removed

**GitHub Issue #85712**
🔗 [github.com/vercel/next.js/issues/85712](https://github.com/vercel/next.js/issues/85712)

- **Status:** Closed as "not planned"
- `next build` no longer shows per-route `Size` and `First Load JS` metrics
- Intentional per PR #83815 — metrics inaccurate for RSC architectures
- Reported November 3, 2025

---

### 4.3 Performance Degradation After Upgrade

**GitHub Issue #85470**
🔗 [github.com/vercel/next.js/issues/85470](https://github.com/vercel/next.js/issues/85470)

- Server requests and latency increasing after v15 → v16
- Related to enhanced routing/navigation architecture

---

### 4.4 Historical: Vercel Static Site File Limits

**GitHub Discussion vercel/vercel #4009**
🔗 [github.com/vercel/vercel/discussions/4009](https://github.com/vercel/vercel/discussions/4009)

- "Maximum pages for static site < 8,000" — predates Next.js 16 but documents practical limits

---

### 4.5 Historical: ISR as Workaround for Build File Limits

**GitHub Discussion vercel/next.js #22710**
🔗 [github.com/vercel/next.js/discussions/22710](https://github.com/vercel/next.js/discussions/22710)

- "Vercel build output files limitation and ISR"

---

### 4.6 Documentation Gap: No Official Explanation of Generated Files

**GitHub Issue #57419**
🔗 [github.com/vercel/next.js/issues/57419](https://github.com/vercel/next.js/issues/57419)
- "Docs: no explanation of generated files and what the .txt files are for" — still open

**GitHub Discussion #59394**
🔗 [github.com/vercel/next.js/discussions/59394](https://github.com/vercel/next.js/discussions/59394)
- "What is the purpose of the .txt files generated for each route?" — community answers only

---

## 5. Per-Route Files: `.next/server/app/` in v16 vs v15 {#njs16-5-per-route-files}

### 5.1 Next.js 15 — Per-Route Files (Webpack)

For a typical statically generated route, Next.js 15 with Webpack generated **~2–3 files** per route:

```
.next/server/app/
  docs/
    my-page/
      page.html           ← Full HTML for initial page load
      page.rsc            ← RSC payload (previously index.rsc)
      page.js             ← Server-side JS bundle (if applicable)
```

### 5.2 Next.js 16 — Per-Route Files (Turbopack Default)

With Turbopack as default, Next.js 16 generates **5–7 files per route**, organized into `.segments/` subdirectories:

```
.next/server/app/
  docs/
    my-page/
      .segments/
        __PAGE__/
          .__full.txt       ← Complete RSC payload + HTML for this segment
          .__head.txt       ← <head> segment data (metadata, title tags)
          .__tree.txt       ← Component tree serialization
          .__index.txt      ← Index/manifest for this segment
          .__PAGE__.txt     ← Page component RSC payload
      page.html             ← Full HTML shell
      page.js               ← Server bundle
      page_client-ref.js    ← Client component references
```

One measured example: a **single "florence" page generating 7 artifacts** in v16 vs 2–3 in v15.

---

### 5.3 What Each `.txt` File Contains

These files contain forms of the **RSC Payload** — serialized React Server Component tree used by React on the client.

| File | Purpose |
|------|---------|
| `.__full.txt` | Complete page RSC payload (used for full page navigations) |
| `.__head.txt` | `<head>` content — metadata, title, Open Graph tags for this route |
| `.__tree.txt` | Serialized component tree structure (enables layout deduplication) |
| `.__index.txt` | Route index/manifest for incremental prefetching |
| `.__PAGE__.txt` | Page component RSC payload specifically (used for partial navigations) |

**Historical note:** Previously called `index.rsc`, renamed to `.txt` during App Router development. Client uses these in `fetch-server-response.ts` to manage prefetching.

**Why the granular split?** Enables the new routing features:
- **Layout deduplication**: Check `__tree.txt` to validate a cached layout without re-fetching the whole page
- **Incremental prefetching**: Only `__head.txt` + `__index.txt` needed on link hover; `__PAGE__.txt` fetched on navigation

---

### 5.4 Data Duplication Bug (v16.0–v16.1)

Large page data appears in **both** `.__full.txt` and `.__PAGE__.txt`. For documentation sites with large content per page, this effectively doubles per-route artifact storage.

- Acknowledged by maintainers as a Turbopack side-effect analysis issue
- Fix planned for v16.2+

---

### 5.5 New `.next/dev/` Directory (v16+)

```
.next/
  dev/          ← NEW: output from `next dev` (isolated)
    trace-turbopack
    ...
  server/       ← production build output from `next build`
    app/
  cache/        ← Turbopack filesystem cache (EXCLUDE from deployment)
```

`dev/` is local only and not deployed. Turbopack `cache/` must be excluded from deployment artifacts.

---

## 6. Workarounds Summary {#njs16-6-workarounds}

| Workaround | Effort | Effectiveness | Notes |
|-----------|--------|--------------|-------|
| **Switch to Webpack** (`--webpack`) | Low | High | Bypasses Turbopack segment files. Loses Turbopack perf gains. Community-confirmed. |
| **Use ISR with fallback** | Medium | High | Vercel's #1 recommendation for >1k pages. |
| **Power-law pre-rendering** | Medium | High | Pre-render top ~200 pages; ISR everything else. |
| **Disable `isolatedDevBuild`** | Low | Low-Medium | Reduces `.next/` bloat from dev output leaking. |
| **Migrate to OpenNext + Cloudflare** | High | High | Eliminates Vercel limits. Major infra change. |
| **Upgrade to 16.1+** | Low | Low | 20MB smaller package. Doesn't fix segment file explosion. |
| **Bundle Analyzer** | Low | Diagnostic | Identifies what's bloated; doesn't reduce size. |
| **Reduce large data props** | Medium | Medium | Addresses data duplication across `.__full.txt`/`.__PAGE__.txt`. |
| **Exclude `.next/cache` from deploy** | Low | Medium | Turbopack build cache must never be in deployment artifacts. |
| **Wait for v16.2** | None | TBD | Turbopack side-effect analysis fix planned. |

---

## 7. Sources {#njs16-7-sources}

### Official Docs

- [Next.js 16 Release Blog](https://nextjs.org/blog/next-16) — October 21, 2025
- [Next.js 16.1 Release Blog](https://nextjs.org/blog/next-16-1) — December 18, 2025
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16) — Updated February 27, 2026
- [Vercel Limits Documentation](https://vercel.com/docs/limits)
- [Vercel KB: Build Output Limits with Next.js](https://vercel.com/kb/guide/what-can-i-do-when-i-run-into-build-output-limits-with-next-js-on-vercel)
- [Vercel KB: Reduce Build Time with Next.js](https://vercel.com/kb/guide/how-do-i-reduce-my-build-time-with-next-js-on-vercel)
- [Vercel KB: Optimize RSC Payload Size](https://vercel.com/kb/guide/how-to-optimize-rsc-payload-size)
- [Vercel Functions Limitations](https://vercel.com/docs/functions/limitations)
- [Vercel KB: Troubleshoot Serverless Function 250MB Limit](https://vercel.com/kb/guide/troubleshooting-function-250mb-limit)
- [Next.js ISR Guide](https://nextjs.org/docs/pages/guides/incremental-static-regeneration)
- [Next.js `output` config reference](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- [Next.js `turbopackFileSystemCache` reference](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackFileSystemCache)
- [Next.js Cache Components docs](https://nextjs.org/docs/app/getting-started/cache-components)
- [Next.js Memory Usage Guide](https://nextjs.org/docs/app/guides/memory-usage)

### GitHub Issues & Discussions

- [vercel/next.js Discussion #86320 — .next folder bigger in Next.js 16](https://github.com/vercel/next.js/discussions/86320) ⭐ PRIMARY
- [vercel/next.js Issue #85712 — next.js 16 lacks build size info](https://github.com/vercel/next.js/issues/85712) — closed "not planned"
- [vercel/next.js Issue #85470 — Server requests and latency increased after v15→v16](https://github.com/vercel/next.js/issues/85470)
- [vercel/next.js Discussion #59394 — Purpose of .txt files per route](https://github.com/vercel/next.js/discussions/59394)
- [vercel/next.js Issue #57419 — Docs: no explanation of generated files](https://github.com/vercel/next.js/issues/57419) — open
- [vercel/next.js Discussion #22710 — Vercel build output files limitation and ISR](https://github.com/vercel/next.js/discussions/22710)
- [vercel/vercel Discussion #4009 — Maximum pages for static site < 8,000](https://github.com/vercel/vercel/discussions/4009)
- [vercel/next.js Discussion #77740 — Build Adapters RFC](https://github.com/vercel/next.js/discussions/77740)
- [vercel/next.js Discussion #87283 — Turbopack filesystem caching feedback](https://github.com/vercel/next.js/discussions/87283)
- [vercel/next.js Discussion #86731 — Bundle Analyzer feedback](https://github.com/vercel/next.js/discussions/86731)

### Community

- [Migrating Next.js 16 from Vercel to Cloudflare: Overcoming the 25MB Limit](https://medium.com/@Yasirgaji/migrating-next-js-16-from-vercel-to-cloudflare-overcoming-the-25mb-limit-aa88e8396b29) — Note: 25MB = Cloudflare Pages limit, not Vercel
- [Next.js 15 vs Next.js 16: What's the Difference? (Descope)](https://www.descope.com/blog/post/nextjs15-vs-nextjs16)
- [OpenNext Cloudflare Adapter](https://opennext.js.org/cloudflare)
- [Vercel Community: What is the build size limit on Vercel?](https://community.vercel.com/t/what-is-the-build-size-limit-on-vercel/3859)

---

## Appendix: Config Flags for Deployment Size Control

```js
// next.config.js

module.exports = {
  // PPR / Cache Components (replaces experimental.ppr in v16)
  cacheComponents: true,

  // Isolated dev build — set false to prevent .next/dev bloat
  isolatedDevBuild: false, // default: true

  // Turbopack config (moved from experimental.turbopack in v16)
  turbopack: { /* options */ },

  experimental: {
    // Turbopack filesystem cache for dev (stable default in 16.1)
    turbopackFileSystemCacheForDev: true,
    // Turbopack filesystem cache for production builds (opt-in)
    turbopackFileSystemCacheForBuild: true,
    // Build Adapters API (alpha)
    adapterPath: require.resolve('./my-adapter.js'),
  },
}
```

*All GitHub issue numbers and URLs verified 2026-03-16.*
