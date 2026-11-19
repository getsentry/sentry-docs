import {DOCS_ORIGIN} from 'sentry-docs/docsSite.mjs';

type Props = {
  pathname: string;
};

/**
 * Returns the URL of a page's Markdown export, for example
 * `platforms/javascript` → `https://docs.sentry.io/platforms/javascript.md`.
 */
export function markdownExportUrl(pathname: string): string {
  return `${DOCS_ORIGIN}/${pathname || 'index'}.md`;
}

/**
 * Plain-text pointer to the page's Markdown export and llms.txt, server-rendered near
 * the top of the page so it survives HTML stripping and truncation by AI agents.
 *
 * DocPage renders this outside `div#main`, which keeps it out of the generated
 * Markdown exports and the Algolia index.
 */
export function MarkdownExportNotice({pathname}: Props) {
  const mdUrl = markdownExportUrl(pathname);
  const llmsUrl = `${DOCS_ORIGIN}/llms.txt`;

  return (
    <p className="text-sm text-[var(--gray-11)] mt-0 mb-6">
      Read this page as Markdown at <a href={mdUrl}>{mdUrl}</a>. For an index of all
      pages, see <a href={llmsUrl}>{llmsUrl}</a>.
    </p>
  );
}
