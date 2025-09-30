import {getCurrentPlatformOrGuide, getPlatform} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {Platform, PlatformGuide} from 'sentry-docs/types';

import {SmartLink} from './smartLink';

function getPlatformsWithFallback(
  rootNode: any,
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
  notSupported?: string[];
  supported?: string[];
  to?: string;
};

export function PlatformLink({children, to, supported = [], notSupported = []}: Props) {
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
    href = currentPlatformOrGuide.url + to.slice(1);
  } else {
    href = `/platform-redirect/?next=${encodeURIComponent(to)}`;
  }
  return <SmartLink href={href}>{children}</SmartLink>;
}
