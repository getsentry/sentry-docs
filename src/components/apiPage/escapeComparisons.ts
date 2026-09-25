import {fromMarkdown} from 'mdast-util-from-markdown';
import {visit} from 'unist-util-visit';

// OpenAPI descriptions are Markdown, where `<4` is text, not an MDX tag.
// Only escape prose so code examples, link destinations, and HTML stay intact.
export function escapeComparisons(source: string): string {
  if (!/<\d/.test(source)) {
    return source;
  }
  const replacements: {start: number; end: number; value: string}[] = [];
  visit(fromMarkdown(source), 'text', node => {
    const start = node.position?.start.offset;
    const end = node.position?.end.offset;
    if (start === undefined || end === undefined) {
      return;
    }
    const text = source.slice(start, end);
    const value = text.replace(/(\\*)<(?=\d)/g, (match, slashes: string) =>
      slashes.length % 2 ? match : `${slashes}&lt;`
    );
    if (value !== text) {
      replacements.push({start, end, value});
    }
  });
  for (const {start, end, value} of replacements.reverse()) {
    source = source.slice(0, start) + value + source.slice(end);
  }
  return source;
}
