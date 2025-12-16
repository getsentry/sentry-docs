import * as Sentry from '@sentry/nextjs';

/**
 * Documentation site metrics tracking
 * All metrics are trace-connected and include standard attributes:
 * - environment (dev/production)
 * - release
 * - SDK info
 *
 * Privacy: No PII, no cookies, no full URLs or user queries
 */
export const DocMetrics = {
  /**
   * Track successful page loads
   * @param pageType - The main documentation section
   * @param attributes - Additional context (has_platform_content, is_versioned, etc.)
   */
  pageLoad: (pageType: PageType, attributes: Record<string, any> = {}) => {
    Sentry.metrics.count('docs.page.load', 1, {
      attributes: {
        page_type: pageType,
        ...attributes,
      },
    });
  },

  /**
   * Track MDX compilation duration (server-side only)
   * @param durationMs - Compilation time in milliseconds
   * @param attributes - Context (cached, file_size_kb, has_images)
   */
  mdxCompile: (durationMs: number, attributes: Record<string, any> = {}) => {
    Sentry.metrics.distribution('docs.mdx.compile_duration', durationMs, {
      attributes,
      unit: 'millisecond',
    });
  },

  /**
   * Track search queries
   * @param hasResults - Whether the search returned results
   * @param resultCount - Number of results
   * @param attributes - Additional context (query_length, includes_platform_filter)
   */
  searchQuery: (
    hasResults: boolean,
    resultCount: number,
    attributes: Record<string, any> = {}
  ) => {
    const bucket =
      resultCount === 0
        ? '0'
        : resultCount <= 5
          ? '1-5'
          : resultCount <= 20
            ? '6-20'
            : '20+';
    Sentry.metrics.count('docs.search.query', 1, {
      attributes: {
        has_results: hasResults,
        result_count_bucket: bucket,
        ...attributes,
      },
    });
  },

  /**
   * Track 404 not found errors
   * @param path - Requested path (first 2 segments only for privacy)
   * @param refererType - Where the request came from
   */
  pageNotFound: (path: string[], refererType: 'internal' | 'external' | 'direct') => {
    Sentry.metrics.count('docs.page.not_found', 1, {
      attributes: {
        requested_path: path.slice(0, 2).join('/'),
        referer_type: refererType,
      },
    });
  },

  /**
   * Track search queries with zero results (indicates content gaps)
   * @param queryLength - Length of the search query
   * @param attributes - Additional context
   */
  searchZeroResults: (queryLength: number, attributes: Record<string, any> = {}) => {
    Sentry.metrics.count('docs.search.zero_results', 1, {
      attributes: {
        query_length: queryLength,
        ...attributes,
      },
    });
  },

  /**
   * Track copy page button clicks
   * @param pathname - Page path being copied
   * @param success - Whether the copy succeeded
   */
  copyPage: (pathname: string, success: boolean) => {
    Sentry.metrics.count('docs.copy_page', 1, {
      attributes: {
        page_path: pathname.split('/').slice(0, 3).join('/'), // First 3 segments
        success,
      },
    });
  },

  /**
   * Track copy page dropdown interactions
   * @param pathname - Current page path
   * @param action - 'open' | 'view_markdown' | 'open_chatgpt' | 'open_claude'
   */
  copyPageDropdown: (pathname: string, action: string) => {
    Sentry.metrics.count('docs.copy_page_dropdown', 1, {
      attributes: {
        page_path: pathname.split('/').slice(0, 3).join('/'), // First 3 segments
        action,
      },
    });
  },

  /**
   * Track code snippet copy button clicks
   * @param pathname - Page where code was copied
   * @param language - Programming language of the snippet
   * @param filename - Filename if present
   */
  snippetCopy: (pathname: string, language?: string, filename?: string) => {
    Sentry.metrics.count('docs.snippet_copy', 1, {
      attributes: {
        page_path: pathname.split('/').slice(0, 3).join('/'), // First 3 segments
        language: language || 'unknown',
        has_filename: !!filename,
      },
    });
  },
};

/**
 * Page type represents the main documentation section
 * Matches the sidebar navigation structure
 */
export type PageType =
  // Main product docs (from productSidebarItems in sidebarNavigation.tsx)
  | 'account' // Account Settings
  | 'organization' // Organization Settings
  | 'product' // Product Walkthroughs
  | 'pricing' // Pricing & Billing
  | 'cli' // Sentry CLI
  | 'api' // Sentry API
  | 'security-legal-pii' // Security, Legal, & PII
  | 'concepts' // Concepts & Reference
  | 'changelog' // Documentation Changelog
  // Platform docs
  | 'platforms' // Platform-specific SDK docs
  | 'platform-redirect' // Platform selection page
  // Other
  | 'contributing' // Contributing to docs
  | 'home' // Homepage
  | 'unknown'; // Fallback for unrecognized paths
