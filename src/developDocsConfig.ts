/**
 * Develop docs roots that should remain indexable by search engines.
 * Noindex to prevent them from competing with docs.sentry.io in search results.
 * Used by both page.tsx (meta tags) and sitemap.ts (sitemap filtering)
 */
export const DEVELOP_DOCS_INDEXABLE_ROOTS = new Set([
  'getting-started',
  'engineering-practices',
  'application-architecture',
  'development-infrastructure',
  'backend',
  'frontend',
  'services',
  'integrations',
  'ingestion',
  'sdk',
  'sdk-setup-wizards',
  'self-hosted',
]);

/**
 * Returns true if a develop docs path should remain indexable.
 */
export function isDevelopDocsIndexablePath(path: string[] | undefined): boolean {
  // Homepage
  if (!path || path.length === 0) {
    return true;
  }
  // Section root pages (e.g., /getting-started/, /backend/)
  return path.length === 1 && DEVELOP_DOCS_INDEXABLE_ROOTS.has(path[0]);
}
