# Turbopack MDX Migration Notes

This branch adds a parallel `src/nextMdx` pipeline that compiles docs with the `@mdx-js/mdx` toolchain. It mirrors our existing `bundleMDX` path but keeps the legacy implementation untouched while the Turbopack migration is in-flight.

## Current Capabilities
- Compiles markdown/MDX strings with the same remark and rehype plugins we rely on today.
- Preserves frontmatter, TOC building, and scoped variable interpolation via `remark-variables`.
- Returns a `NextMdxCompiledFile` shape that matches `getFileBySlug` outputs (frontmatter, code, TOC, gray-matter metadata).

## Open TODOs
- Replace hand-rolled asset handling currently provided by esbuild (image imports, static asset copies).
- Wire the pipeline into Next’s routing (`app/[[...path]]/page.tsx`) behind a feature flag.
- Confirm compatibility with API reference markdown rendering (`src/components/apiPage`).
- Add Vitest coverage so stubs catch regressions when we swap implementations.

## Next Steps
1. Extend `compileWithNextMdx` tests to cover headings, variables, and platform config overrides.
2. Hook `createMDX` from `@next/mdx` into `next.config.ts` to make Turbopack aware of `.md/.mdx` imports.
3. Gradually switch selected pages (e.g. `/app/mdx-playground`) to the new pipeline before flipping the default.
