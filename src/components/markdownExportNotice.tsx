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

/** Drops the protocol so screen readers don't read out "https://" on every page. */
function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, '');
}

/**
 * Plain-text pointer to the page's Markdown export and llms.txt, server-rendered near
 * the top of the page so it survives HTML stripping and truncation by AI agents.
 * The visible URLs stay resolvable after an agent strips the `href`s.
 *
 * DocPage renders this outside `div#main`, which keeps it out of the generated
 * Markdown exports and the Algolia index.
 */
export function MarkdownExportNotice({pathname}: Props) {
  const mdUrl = markdownExportUrl(pathname);
  const llmsUrl = `${DOCS_ORIGIN}/llms.txt`;

  return (
    <p className="text-sm text-[var(--gray-11)] mt-0 mb-6">
      Markdown version: <a href={mdUrl}>{displayUrl(mdUrl)}</a>. Index of all pages:{' '}
      <a href={llmsUrl}>{displayUrl(llmsUrl)}</a>.
    </p>
  );
}
