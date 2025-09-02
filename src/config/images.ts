export const REMOTE_IMAGE_HOSTNAMES = [
  'user-images.githubusercontent.com',
  'sentry-brand.storage.googleapis.com',
] as const;

export const REMOTE_IMAGE_PATTERNS = REMOTE_IMAGE_HOSTNAMES.map(hostname => ({
  protocol: 'https' as const,
  hostname,
}));

export function isExternalImage(src: string): boolean {
  return src.startsWith('http') || src.startsWith('//');
}

export function isAllowedRemoteImage(src: string): boolean {
  try {
    // Handle protocol-relative URLs by adding https: protocol
    const normalizedSrc = src.startsWith('//') ? `https:${src}` : src;
    const url = new URL(normalizedSrc);
    return (
      url.protocol === 'https:' &&
      (REMOTE_IMAGE_HOSTNAMES as readonly string[]).includes(url.hostname)
    );
  } catch (_error) {
    return false;
  }
}
