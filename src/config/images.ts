export const REMOTE_IMAGE_HOSTNAMES = [
  'user-images.githubusercontent.com',
  'sentry-brand.storage.googleapis.com',
] as const;

export const REMOTE_IMAGE_PATTERNS = REMOTE_IMAGE_HOSTNAMES.map(hostname => ({
  protocol: 'https' as const,
  hostname,
}));

export function isAllowedRemoteImage(src: string): boolean {
  try {
    const url = new URL(src);
    return (
      url.protocol === 'https:' &&
      (REMOTE_IMAGE_HOSTNAMES as readonly string[]).includes(url.hostname)
    );
  } catch (_error) {
    return false;
  }
}
