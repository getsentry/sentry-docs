const ABSOLUTE_HTTP_URL = /^https?:\/\//i;

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

/**
 * Canonical URL for a docs page.
 *
 * `customCanonicalTag` may be a site-relative path, which is resolved against
 * `origin`, or an absolute http(s) URL, which is used as written.
 */
export function resolvePageCanonical(
  pathname: string,
  customCanonicalTag: string | undefined,
  origin: string
): string {
  if (customCanonicalTag && ABSOLUTE_HTTP_URL.test(customCanonicalTag)) {
    return customCanonicalTag;
  }

  return `${origin}${canonicalPath(customCanonicalTag || pathname)}`;
}
