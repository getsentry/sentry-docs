// Only used to resolve `next` into an absolute URL so it can be origin
// checked. It never forms part of the returned value.
const BASE_ORIGIN = 'https://docs.sentry.io';

export const sanitizeNext = (next: string) => {
  // Links are built with `encodeURIComponent`, so the path arrives encoded
  let decoded: string;
  try {
    decoded = decodeURIComponent(next);
  } catch {
    // Return empty string if decoding fails
    return '';
  }

  // No legitimate docs path contains a colon, and it keeps scheme-like input
  // (`javascript:`, `data:`) from ever reaching the parser
  if (decoded.includes(':')) {
    return '';
  }

  let url: URL;
  try {
    // The WHATWG parser applies the same normalization a browser would —
    // backslashes become slashes, `//host` and `/\host` resolve to an external
    // host, dot segments collapse — so anything escaping our origin shows up
    // as a differing `origin` rather than as a path we would have to untangle
    // ourselves.
    url = new URL(decoded, BASE_ORIGIN);
  } catch {
    return '';
  }

  if (url.origin !== BASE_ORIGIN) {
    return '';
  }

  // Drop query and hash (`url.pathname` excludes both), and allow only
  // alphanumeric, hyphens and slashes
  const pathname = url.pathname
    .replace(/[^\w\-\/]/g, '')
    // Stripping characters can leave adjacent slashes behind (`/,/evil` ->
    // `//evil`), which would resolve as protocol-relative. Collapse them.
    .replace(/\/{2,}/g, '/');

  return pathname === '/' ? '' : pathname;
};
