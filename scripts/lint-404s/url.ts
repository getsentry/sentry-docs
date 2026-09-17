export function resolveLinkUrl(href: string, pageUrl: URL): URL | null {
  try {
    return new URL(href, pageUrl);
  } catch {
    return null;
  }
}

export function isInternalUrl(url: URL, baseUrl: URL, internalHostname: string): boolean {
  return url.origin === baseUrl.origin || url.hostname === internalHostname;
}

export function resolveInternalUrl(
  url: URL,
  baseUrl: URL,
  internalHostname: string
): URL {
  return url.hostname === internalHostname && url.origin !== baseUrl.origin
    ? new URL(`${url.pathname}${url.search}${url.hash}`, baseUrl)
    : url;
}
