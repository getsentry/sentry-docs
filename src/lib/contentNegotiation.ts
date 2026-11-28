/**
 * Accept header negotiation between the HTML page and its Markdown export.
 * Used by middleware to decide which representation a page URL returns.
 */

const MARKDOWN_TYPES = ['text/markdown', 'text/x-markdown'];
const HTML_TYPES = ['text/html', 'application/xhtml+xml'];

/** The format an Accept header asks for, or `none` when it names neither. */
export type FormatPreference = 'markdown' | 'html' | 'none';

/**
 * Highest quality value the Accept header gives any of `types`, or `undefined`
 * when it names none of them. Wildcards (`*\/*`, `text/*`) are not a preference
 * for either format, so they are ignored.
 */
function qualityFor(acceptHeader: string, types: string[]): number | undefined {
  let best: number | undefined;
  for (const range of acceptHeader.split(',')) {
    const [mediaType, ...params] = range.split(';').map(part => part.trim());
    if (!types.includes(mediaType.toLowerCase())) {
      continue;
    }
    const qParam = params.find(param => /^q=/i.test(param));
    const parsed = qParam ? Number.parseFloat(qParam.slice(2)) : 1;
    const q = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 1) : 1;
    best = best === undefined ? q : Math.max(best, q);
  }
  return best;
}

/**
 * Reads the client's format preference from its Accept header, honoring
 * quality values. Markdown wins a tie, so `text/markdown, text/html` gets
 * Markdown and `text/html, text/markdown;q=0.9` gets HTML.
 * `text/plain` is not treated as Markdown: clients like Axios send it by default.
 */
export function formatPreference(acceptHeader: string): FormatPreference {
  const markdownQ = qualityFor(acceptHeader, MARKDOWN_TYPES);
  const htmlQ = qualityFor(acceptHeader, HTML_TYPES);

  if (markdownQ === undefined && htmlQ === undefined) {
    return 'none';
  }
  if (markdownQ === undefined || markdownQ === 0) {
    return 'html';
  }
  return htmlQ === undefined || markdownQ >= htmlQ ? 'markdown' : 'html';
}

/**
 * Whether a page URL returns Markdown. A recognized AI agent always gets
 * Markdown, because fetchers such as ChatGPT-User and PerplexityBot send a
 * browser's Accept header. Any other client gets Markdown when its Accept header
 * prefers it.
 */
export function shouldServeMarkdown(acceptHeader: string, isAIAgent: boolean): boolean {
  return isAIAgent || formatPreference(acceptHeader) === 'markdown';
}
