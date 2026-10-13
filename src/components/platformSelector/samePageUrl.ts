import {Platform, PlatformGuide, PlatformIntegration} from 'sentry-docs/types';
import {getUnversionedPath} from 'sentry-docs/versioning';

type PlatformOrGuide = Pick<
  Platform | PlatformGuide | PlatformIntegration,
  'type' | 'url'
>;

/**
 * Returns the URLs to try, in order, when switching to `target` from `pathname`,
 * so that users land on the same page for the new platform when it exists:
 *
 * - platforms: the same page, then its parent page
 * - guides: the same page
 * - integrations: none
 *
 * The target's own URL (its root page) is the fallback and is not included.
 */
export function getSamePageCandidates(
  target: PlatformOrGuide,
  pathname: string
): string[] {
  if (target.type === 'integration') {
    return [];
  }

  // Versioned pages (e.g. `/options__v8.x/`) map to the unversioned page
  const parts = getUnversionedPath(pathname, false).split('/').filter(Boolean);
  if (parts[0] !== 'platforms') {
    return [];
  }
  // Drop /platforms/:platform or /platforms/:platform/guides/:guide
  const isGuidePage = parts.length >= 4 && parts[2] === 'guides';
  const relativeParts = parts.slice(isGuidePage ? 4 : 2);
  if (relativeParts.length === 0) {
    return [];
  }

  const candidates = [target.url + relativeParts.join('/') + '/'];
  if (target.type === 'platform' && relativeParts.length > 1) {
    candidates.push(target.url + relativeParts.slice(0, -1).join('/') + '/');
  }
  return candidates;
}

async function pageExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {method: 'HEAD'});
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Resolves the URL to navigate to when switching to `target`: the first existing
 * page from {@link getSamePageCandidates}, or the target's root page.
 */
export async function resolveSamePageUrl(
  target: PlatformOrGuide,
  pathname: string
): Promise<string> {
  for (const candidate of getSamePageCandidates(target, pathname)) {
    if (await pageExists(candidate)) {
      return candidate;
    }
  }
  return target.url;
}
