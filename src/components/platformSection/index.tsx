import {
  DocNode,
  getCurrentPlatformOrGuide,
  getGuide,
  getPlatform,
} from 'sentry-docs/docTree';
import {
  getFallbackGuideName,
  isPlatformSupported as resolvePlatformSupport,
} from 'sentry-docs/platformSupport';
import {serverContext} from 'sentry-docs/serverContext';
import {Platform, PlatformGuide} from 'sentry-docs/types';

import styles from './style.module.css';

function getPlatformSupportKeys(
  rootNode: DocNode,
  platformOrGuide: Platform | PlatformGuide
): string[] {
  const result: string[] = [];
  const visited = new Set<string>();
  let current: Platform | PlatformGuide | undefined = platformOrGuide;

  while (current && !visited.has(current.key)) {
    result.push(current.key);
    visited.add(current.key);

    if (current.type === 'guide') {
      const parentPlatform = current.platform;
      if (current.fallbackGuide && !visited.has(current.fallbackGuide)) {
        const fallbackGuide = current.fallbackGuide;
        const guideName = getFallbackGuideName(parentPlatform, fallbackGuide);
        const fallback = getGuide(rootNode, parentPlatform, guideName);
        if (fallback) {
          current = fallback;
          continue;
        }
        result.push(fallbackGuide);
        visited.add(fallbackGuide);
      }
      // Do not inherit the guide's structural parent platform. Sections use
      // base-platform keys to distinguish platform content from guide content.
    }

    current = current.fallbackPlatform
      ? getPlatform(rootNode, current.fallbackPlatform)
      : undefined;
  }

  return result;
}

type Props = {
  children?: React.ReactNode;
  noGuides?: boolean;
  notSupported?: string[];
  platform?: string;
  supported?: string[];
};

/**
 * Resolves the same `supported` / `notSupported` rules as `PlatformSection`
 * for a platform or guide, walking its fallback chain.
 */
export function isPlatformSupported(
  rootNode: DocNode,
  platformOrGuide: Platform | PlatformGuide,
  supported: string[] = [],
  notSupported: string[] = []
): boolean {
  return resolvePlatformSupport(getPlatformSupportKeys(rootNode, platformOrGuide), {
    supported,
    notSupported,
  });
}

/**
 * Conditionally renders children based on the current platform or guide.
 *
 * @param supported - Array of platform/guide keys that should show this content
 * @param notSupported - Array of platform/guide keys that should not show this content
 * @param noGuides - If true, content will not be shown for platform guides
 * @param children - Content to be conditionally rendered
 * @param platform - (Optional) Override the current platform
 *
 * Note: This component checks against platform and guide keys (e.g. 'python', 'react').
 * For filtering by platform categories (e.g. 'browser', 'node'),
 * use PlatformCategorySection instead.
 */
export function PlatformSection({
  supported = [],
  notSupported = [],
  noGuides,
  children,
}: Props) {
  const {rootNode, path} = serverContext();
  const currentPlatformOrGuide = getCurrentPlatformOrGuide(rootNode, path);

  if (!currentPlatformOrGuide) {
    return null;
  }

  if (noGuides && currentPlatformOrGuide.type !== 'platform') {
    return null;
  }

  if (!isPlatformSupported(rootNode, currentPlatformOrGuide, supported, notSupported)) {
    return null;
  }

  return <div className={styles['no-space-around-ul']}>{children}</div>;
}
