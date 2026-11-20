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

/** Whether a `customCanonicalTag` points off this site (an absolute http(s) URL). */
export function isExternalCanonical(customCanonicalTag: string | undefined): boolean {
  return !!customCanonicalTag && ABSOLUTE_HTTP_URL.test(customCanonicalTag);
}

/**
 * Canonical URL for a docs page. `target` is the page's `customCanonicalTag`,
 * or its path when there is none. Absolute http(s) URLs are used as written;
 * everything else is resolved against `origin`.
 */
export function resolvePageCanonical(target: string, origin: string): string {
  return isExternalCanonical(target) ? target : `${origin}${canonicalPath(target)}`;
}
