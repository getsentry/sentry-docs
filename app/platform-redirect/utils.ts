// Parse base only — never part of the return value, and only compared against itself
const PARSE_BASE = 'https://sanitize.invalid';

// Heading slugs in the docs are word characters, hyphens and dots
// (for example `godot_logger.event_mask`)
const SAFE_HASH = /^#[\w.-]+$/;

export type SanitizedNext = {
  /** Empty, or a `#`-prefixed fragment safe to append to a resolved URL */
  hash: string;
  /** Empty, or an absolute docs path with no origin, query or fragment */
  pathname: string;
};

const EMPTY: SanitizedNext = {pathname: '', hash: ''};

export const sanitizeNext = (next: string): SanitizedNext => {
  let decoded: string;
  try {
    decoded = decodeURIComponent(next);
  } catch {
    return EMPTY;
  }

  // No docs path contains a colon; also keeps `javascript:`/`data:` out of the parser
  if (decoded.includes(':')) {
    return EMPTY;
  }

  let url: URL;
  try {
    // WHATWG normalization matches the browser: backslashes and control chars
    // become/collapse to slashes and dot segments resolve, so anything escaping
    // our origin shows up as a foreign `origin` rather than as a path to untangle
    url = new URL(decoded, PARSE_BASE);
  } catch {
    return EMPTY;
  }

  if (url.origin !== PARSE_BASE) {
    return EMPTY;
  }

  const pathname = url.pathname
    .replace(/[^\w\-\/]/g, '')
    // stripping can leave `//`, which would resolve as protocol-relative
    .replace(/\/{2,}/g, '/');

  // The fragment is kept apart from the path: callers resolve the path against the
  // doc tree and only append the fragment to the URL they build from it. A fragment
  // we don't recognize is dropped rather than failing the whole redirect.
  const hash = SAFE_HASH.test(url.hash) ? url.hash : '';

  return {pathname: pathname === '/' ? '' : pathname, hash};
};

/**
 * Joins a platform URL (which always ends in `/`) with a sanitized path and fragment
 * without leaving the `//` that would cost an extra redirect hop.
 */
export const platformUrlFor = (
  platformUrl: string,
  {pathname, hash}: SanitizedNext
): string => {
  const base = pathname ? `${platformUrl.replace(/\/+$/, '')}${pathname}` : platformUrl;
  return `${base}${hash}`;
};
