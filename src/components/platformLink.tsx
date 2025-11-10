import {getCurrentPlatformOrGuide, getPlatform, nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {Platform, PlatformGuide} from 'sentry-docs/types';

import {SmartLink} from './smartLink';

function getPlatformsWithFallback(
  rootNode: any,
  platformOrGuide: Platform | PlatformGuide
) {
  const result = [platformOrGuide.key];
  let curPlatformOrGuide: Platform | PlatformGuide | undefined = platformOrGuide;

  while (curPlatformOrGuide) {
    let fallbackKey: string | undefined;

    // For guides, check fallbackGuide first
    if ('fallbackGuide' in curPlatformOrGuide && curPlatformOrGuide.fallbackGuide) {
      // fallbackGuide is the full key like "javascript.node"
      result.push(curPlatformOrGuide.fallbackGuide);
      // After the guide fallback, also check the guide's parent platform
      const guidePlatform = getPlatform(rootNode, curPlatformOrGuide.platform);
      if (guidePlatform?.fallbackPlatform) {
        result.push(guidePlatform.fallbackPlatform);
      }
      break;
    }
    // For JavaScript guides without explicit fallbackGuide, check if they're server-side
    // If so, include node in the fallback chain
    else if (
      'platform' in curPlatformOrGuide &&
      curPlatformOrGuide.platform === 'javascript' &&
      (curPlatformOrGuide.categories?.includes('server') ||
        curPlatformOrGuide.categories?.includes('serverless'))
    ) {
      // Include node platform for server-side JavaScript guides
      result.push('node');
      break;
    }
    // For platforms, check fallbackPlatform
    else if (curPlatformOrGuide.fallbackPlatform) {
      fallbackKey = curPlatformOrGuide.fallbackPlatform;
      result.push(fallbackKey);
      curPlatformOrGuide = getPlatform(rootNode, fallbackKey);
    } else {
      break;
    }
  }

  return result;
}

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

type Props = {
  children: React.ReactNode;
  fallbackPlatform?: string;
  notSupported?: string[];
  supported?: string[];
  to?: string;
};

export function PlatformLink({
  children,
  to,
  supported = [],
  notSupported = [],
  fallbackPlatform,
}: Props) {
  if (!to) {
    return children;
  }

  const {rootNode, path} = serverContext();
  const currentPlatformOrGuide = getCurrentPlatformOrGuide(rootNode, path);

  // Check platform support if we have a current platform and support constraints
  if (currentPlatformOrGuide && (supported.length > 0 || notSupported.length > 0)) {
    const platformsToSearch = getPlatformsWithFallback(rootNode, currentPlatformOrGuide);

    let result: boolean | null = null;
    // eslint-disable-next-line no-cond-assign
    for (let platformKey: string, i = 0; (platformKey = platformsToSearch[i]); i++) {
      if (!platformKey) {
        continue;
      }
      result = isSupported(platformKey, supported, notSupported);
      if (result === false) {
        // Platform is not supported, hide completely
        return null;
      }
      if (result === true) {
        break;
      }
    }
    if (result === null && supported.length) {
      // No supported platform found, hide completely
      return null;
    }
  }

  let href: string;
  if (currentPlatformOrGuide) {
    if (fallbackPlatform) {
      const pathParts = to.split('/').filter(Boolean);
      const platformsToCheck = getPlatformsWithFallback(rootNode, currentPlatformOrGuide);
      let contentExistsInChain = false;

      for (const platformKey of platformsToCheck) {
        let platformPath: string[];
        if (platformKey.includes('.')) {
          const [platform, guide] = platformKey.split('.');
          platformPath = ['platforms', platform, 'guides', guide];
        } else {
          platformPath = ['platforms', platformKey];
        }

        const targetNode = nodeForPath(rootNode, [...platformPath, ...pathParts]);

        if (targetNode) {
          contentExistsInChain = true;
          break;
        }
      }

      // If content exists anywhere in the natural fallback chain, use current platform URL
      // Otherwise, use the explicit fallbackPlatform
      if (contentExistsInChain) {
        href = currentPlatformOrGuide.url + to.slice(1);
      } else {
        const fallbackPlatformObj = getPlatform(rootNode, fallbackPlatform);
        if (fallbackPlatformObj) {
          href = fallbackPlatformObj.url + to.slice(1);
        } else {
          // Fallback platform not found, construct URL manually
          href = `/platforms/${fallbackPlatform}${to}`;
        }
      }
    } else {
      href = currentPlatformOrGuide.url + to.slice(1);
    }
  } else {
    href = `/platform-redirect/?next=${encodeURIComponent(to)}`;
  }

  return <SmartLink href={href}>{children}</SmartLink>;
}
