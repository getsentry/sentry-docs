import {canonicalPath} from './canonical';

export type InternalLinkClickProps = {
  destinationPath: string;
  destinationSection: string;
  sourcePath: string;
  sourceSection: string;
};

/**
 * Normalize a docs pathname so equivalent URLs are reported consistently and
 * match the paths Next.js serves (and Plausible records as pageviews), e.g.
 * `/product/logs` and `/product/logs/` both become `/product/logs/`, while
 * file-like paths such as `/platforms/java/migration/7.x-to-8.0/` lose their
 * trailing slash.
 */
export function normalizeDocsPath(pathname: string): string {
  return canonicalPath(pathname);
}

/**
 * The top-level docs section for a path, e.g. `/concepts/key-terms/` -> `concepts`.
 */
export function getDocsSection(pathname: string): string {
  const [firstSegment] = pathname.split('/').filter(Boolean);
  return firstSegment ?? 'home';
}

/**
 * Build the Plausible props for a click on an internal docs link.
 *
 * Returns `null` when the link should not be tracked as a page-to-page
 * navigation: other origins, non-HTTP(S) links, or links to the current page
 * (for example, anchors within the same page).
 */
export function getInternalLinkClickProps(
  href: string,
  currentHref: string
): InternalLinkClickProps | null {
  let current: URL;
  let destination: URL;
  try {
    current = new URL(currentHref);
    destination = new URL(href, current);
  } catch {
    return null;
  }

  if (
    destination.origin !== current.origin ||
    !['http:', 'https:'].includes(destination.protocol)
  ) {
    return null;
  }

  const sourcePath = normalizeDocsPath(current.pathname);
  const destinationPath = normalizeDocsPath(destination.pathname);

  if (sourcePath === destinationPath) {
    return null;
  }

  return {
    sourcePath,
    sourceSection: getDocsSection(sourcePath),
    destinationPath,
    destinationSection: getDocsSection(destinationPath),
  };
}
