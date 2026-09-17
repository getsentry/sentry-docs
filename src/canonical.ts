/**
 * Formats a documentation pathname to match Next.js's `trailingSlash: true`
 * redirects. Next.js treats a final segment ending in `.<word characters>` as
 * file-like and removes its trailing slash.
 */
export function canonicalPath(pathname: string): string {
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withoutTrailingSlash = withLeadingSlash.replace(/\/+$/, '');

  if (!withoutTrailingSlash) {
    return '/';
  }

  const finalSegment = withoutTrailingSlash.slice(
    withoutTrailingSlash.lastIndexOf('/') + 1
  );
  return /\.\w+$/.test(finalSegment) ? withoutTrailingSlash : `${withoutTrailingSlash}/`;
}
