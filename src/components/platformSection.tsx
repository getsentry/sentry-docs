import {DocNode, getCurrentPlatformOrGuide, getPlatform} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {Platform, PlatformGuide} from 'sentry-docs/types';

function getPlatformsWithFallback(
  rootNode: DocNode,
  platformOrGuide: Platform | PlatformGuide
) {
  const result = [platformOrGuide.key];
  let curPlatform: Platform | PlatformGuide | undefined = platformOrGuide;
  while (curPlatform?.fallbackPlatform) {
    result.push(curPlatform.fallbackPlatform);
    curPlatform = getPlatform(rootNode, curPlatform.fallbackPlatform);
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

const isSupported = (
  platformKey: string,
  supported: string[],
  notSupported: string[]
): boolean | null => {
  if (supported.length && supported.find(p => p === platformKey)) {
    return true;
  }
  if (notSupported.length && notSupported.find(p => p === platformKey)) {
    return false;
  }
  return null;
};

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

  const platformsToSearch = getPlatformsWithFallback(rootNode, currentPlatformOrGuide);

  let result: boolean | null = null;
  // eslint-disable-next-line no-cond-assign
  for (let platformKey: string, i = 0; (platformKey = platformsToSearch[i]); i++) {
    if (!platformKey) {
      continue;
    }
    result = isSupported(platformKey, supported, notSupported);
    if (result === false) {
      return null;
    }
    if (result === true) {
      break;
    }
  }
  if (result === null && supported.length) {
    return null;
  }

  return children;
}
