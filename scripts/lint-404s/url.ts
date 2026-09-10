export function resolveLinkUrl(href: string, pageUrl: URL): URL | null {
  try {
    return new URL(href, pageUrl);
  } catch {
    return null;
  }
}
