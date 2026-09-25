/** OpenAPI prose can contain comparisons like <4, which MDX mistakes for JSX tags. */
export function escapeApiMarkdownComparisons(source: string): string {
  return source.replace(/<(?=\d)/g, '&lt;');
}
