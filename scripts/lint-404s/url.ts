export function resolveLinkUrl(href: string, pageUrl: URL): URL | null {
  try {
    return new URL(href, pageUrl);
  } catch {
    return null;
  }
}

export function isInternalUrl(url: URL, baseURL: URL, canonicalOrigin: string) {
  return url.origin === baseURL.origin || url.origin === canonicalOrigin;
}

export function localizeUrl(url: URL, baseURL: URL, canonicalOrigin: string) {
  return url.origin === canonicalOrigin && url.origin !== baseURL.origin
    ? new URL(`${url.pathname}${url.search}${url.hash}`, baseURL)
    : url;
}
