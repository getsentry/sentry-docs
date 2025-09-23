# Turbopack MDX Migration Notes

This branch adds a parallel `src/nextMdx` pipeline that compiles docs with the `@mdx-js/mdx` toolchain. It mirrors our existing `bundleMDX` path but keeps the legacy implementation untouched while the Turbopack migration is in-flight.

## Current Capabilities
- Compiles markdown/MDX strings with the same remark and rehype plugins we rely on today.
- Preserves frontmatter, TOC building, and scoped variable interpolation via `remark-variables`.
- Returns a `NextMdxCompiledFile` shape that matches `getFileBySlug` outputs (frontmatter, code, TOC, gray-matter metadata).
- Exercises the pipeline end-to-end in Vitest so frontmatter merges, headings, and variable resolution stay stable.
- Serves local images directly from the repo via a `/mdx-images/*` route instead of copying assets with esbuild.

## Open TODOs
- Monitor the new `/mdx-images/*` route and consider pre-generating critical assets if latency becomes an issue.
- Wire the pipeline into Next’s routing (`app/[[...path]]/page.tsx`) behind a feature flag.
- Confirm compatibility with API reference markdown rendering (`src/components/apiPage`).
- Expand test fixtures to cover multi-level TOCs, admonitions, and platform overrides.

## Local Testing
- `yarn dev --turbopack` (or `yarn dev`) now exercises the MDX pipeline in both development and production builds.
- Relative images are served via the new `/mdx-images/*` route, so there’s no esbuild copy step or cache to clear.
- When comparing against historical builds, clear `.next/` to avoid stale artifacts from the old pipeline.

## Next Steps
1. Extract shared remark/rehype presets so both the custom compiler and Next’s loader can reuse them.
2. Replace filesystem-driven rendering with direct `.mdx` imports via `@next/mdx`, keeping frontmatter/TOC data in a lightweight manifest.
3. Remove the remaining file-system reads in `getFileBySlug` once the manifest is in place, and let Turbopack build the pages incrementally.
