/**
 * Shared constants and utilities for agent setup prompt building.
 * Used by AgentSetupCallout (full banner) and inline copy-prompt buttons.
 */

export const DOCS_ORIGIN = 'https://docs.sentry.io';

/** Fallback when a page-specific docs URL is unavailable. */
export const DEFAULT_DOCS_URL = `${DOCS_ORIGIN}/platforms.md`;

/** Convert a docs path or full docs URL into a markdown export URL. */
export function toDocsMarkdownUrl(docsPathOrUrl: string): string {
  if (docsPathOrUrl.startsWith('http://') || docsPathOrUrl.startsWith('https://')) {
    const url = new URL(docsPathOrUrl);
    const cleanPath = url.pathname.replace(/\/$/, '').replace(/\.md$/, '');
    return `${url.origin}${cleanPath || '/index'}.md`;
  }

  const cleanPath = docsPathOrUrl
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .replace(/\.md$/, '');
  return `${DOCS_ORIGIN}/${cleanPath || 'index'}.md`;
}

/**
 * Build a copy-paste prompt that points an agent at docs markdown.
 * Prefer a page-specific docs path/URL when available.
 */
export function buildPrompt(options?: {
  docsUrl?: string;
  platformName?: string;
  /** Optional verb phrase, e.g. "enable span streaming". Defaults to setup. */
  task?: string;
}): string {
  const docsUrl = toDocsMarkdownUrl(options?.docsUrl || DEFAULT_DOCS_URL);
  if (options?.task) {
    return `Read and follow ${docsUrl} to ${options.task}.`;
  }
  const target = options?.platformName
    ? `the Sentry ${options.platformName} SDK`
    : 'Sentry';
  return `Read and follow ${docsUrl} to set up ${target}.`;
}
