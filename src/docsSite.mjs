// Which docs site this build serves: docs.sentry.io or develop.sentry.dev.
//
// Plain ESM JavaScript so the Next.js app, the edge middleware, and the
// Node build scripts in scripts/ all read the same values.

/**
 * True when building develop.sentry.dev.
 *
 * NEXT_PUBLIC_DEVELOPER_DOCS is the variable people set. next.config.ts copies it
 * into DEVELOPER_DOCS, which Next.js inlines into the edge middleware bundle.
 */
export const isDeveloperDocs = !!(
  process.env.DEVELOPER_DOCS || process.env.NEXT_PUBLIC_DEVELOPER_DOCS
);

/** Production origin of the site, without a trailing slash. */
export const DOCS_ORIGIN = isDeveloperDocs
  ? 'https://develop.sentry.dev'
  : 'https://docs.sentry.io';

/** Pre-computed doc tree, written to public/ and .next/ by scripts/generate-doctree.ts. */
export const DOCTREE_FILENAME = isDeveloperDocs ? 'doctree-dev.json' : 'doctree.json';
