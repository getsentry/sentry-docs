import React, {Fragment} from 'react';

import {getPlatformsWithFallback, Platform, usePlatform} from './hooks/usePlatform';

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

export function PlatformSection({
  supported = [],
  notSupported = [],
  platform,
  noGuides,
  children,
}: Props) {
  const [currentPlatform] = usePlatform(platform);
  if (noGuides && !(currentPlatform as Platform).guides) {
    return null;
  }

  const platformsToSearch = getPlatformsWithFallback(currentPlatform);

  let result: boolean | null = null;
  // eslint-disable-next-line no-cond-assign
  for (let platformKey, i = 0; (platformKey = platformsToSearch[i]); i++) {
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

  return <Fragment>{children}</Fragment>;
}
