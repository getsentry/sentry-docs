Now let me fetch one more source to get detailed information about the per-route file structure:Now I have all the information I need. Let me write the comprehensive research file:The file has existing research. I'll append the Next.js 16 research as a new section:The research has been written to `/Users/sergiydybskiy/src/sentry-docs/.pi/research.md`. Here's a summary of all key findings:

---

## Research Summary

### 1. What Changed in Next.js 16 Output Format

The biggest driver is **Turbopack becoming the default bundler**. It generates granular **per-segment artifacts** per route instead of 2–3 files. Key changes:

- **New `.segments/` subdirectories** per route in `.next/server/app/` with 5–7 files each
- **New `.next/dev/` directory** for isolated dev builds (doubles total `.next/` size locally)
- **PPR removed** → replaced by `cacheComponents: true` (was `experimental.dynamicIO`)
- **`experimental_ppr` route segment config removed**
- **Build size metrics removed** from `next build` output (intentional, Issue #85712 closed "not planned")
- **Enhanced routing** (layout deduplication + incremental prefetching) requires those granular segment artifacts

### 2. Vercel Limits (Clarified)

- **No 75MB limit** found in current docs — that's likely the **Cloudflare Pages** edge bundle limit
- **15,000 source files** max for CLI deployments (hard limit, fails at build step)
- **No hard limit** on build *output* files, but the **45-minute build time cap** is the effective constraint
- Source upload: 100 MB (Hobby) / 1 GB (Pro)

### 3. Large Sites (10k+ pages)

Observed 1.8–2× `.next/` folder growth. Solutions being used: ISR/fallback, reverting to Webpack (`--webpack`), power-law pre-rendering (top ~200 pages statically + ISR everything else), OpenNext + Cloudflare migration.

### 4. Key GitHub Issues

| Issue | # | Status |
|-------|---|--------|
| `.next` folder bigger in v16 | [#86320](https://github.com/vercel/next.js/discussions/86320) | Open |
| Build size info removed | [#85712](https://github.com/vercel/next.js/issues/85712) | Closed "not planned" |
| Latency increase after upgrade | [#85470](https://github.com/vercel/next.js/issues/85470) | Open |
| .txt files undocumented | [#57419](https://github.com/vercel/next.js/issues/57419) | Open |

### 5. Per-Route Files

| v15 (Webpack) | v16 (Turbopack) |
|---|---|
| `page.html`, `page.rsc`, `page.js` (~2–3 files) | `.segments/__PAGE__/.__full.txt`, `.__head.txt`, `.__tree.txt`, `.__index.txt`, `.__PAGE__.txt` + `page.html`, `page.js`, `page_client-ref.js` (~7 files) |