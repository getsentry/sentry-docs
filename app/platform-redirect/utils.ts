// Parse base only — never part of the return value, and only compared against itself
const PARSE_BASE = 'https://sanitize.invalid';

export const sanitizeNext = (next: string) => {
  let decoded: string;
  try {
    decoded = decodeURIComponent(next);
  } catch {
    return '';
  }

  // No docs path contains a colon; also keeps `javascript:`/`data:` out of the parser
  if (decoded.includes(':')) {
    return '';
  }

  let url: URL;
  try {
    // WHATWG normalization matches the browser: backslashes and control chars
    // become/collapse to slashes and dot segments resolve, so anything escaping
    // our origin shows up as a foreign `origin` rather than as a path to untangle
    url = new URL(decoded, PARSE_BASE);
  } catch {
    return '';
  }

  if (url.origin !== PARSE_BASE) {
    return '';
  }

  const pathname = url.pathname
    .replace(/[^\w\-\/]/g, '')
    // stripping can leave `//`, which would resolve as protocol-relative
    .replace(/\/{2,}/g, '/');

  return pathname === '/' ? '' : pathname;
};
