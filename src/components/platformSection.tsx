import React from "react";

import usePlatform, { Platform } from "./hooks/usePlatform";

type Props = {
  supported?: string[];
  notSupported?: string[];
  platform?: string;
  noGuides?: boolean;
  children?: React.ReactNode;
};

const isSupported = (
  platformKey: string,
  supported: string[],
  notSupported: string[]
): boolean | null => {
  if (supported.length && supported.find(p => p === platformKey)) {
    return true;
  } else if (notSupported.length && notSupported.find(p => p === platformKey)) {
    return false;
  }
  return null;
};

export default ({
  supported = [],
  notSupported = [],
  platform,
  noGuides,
  children,
}: Props): JSX.Element => {
  const [currentPlatform] = usePlatform(platform);
  if (noGuides && !(currentPlatform as Platform).guides) {
    return null;
  }

  const platformsToSearch = [
    currentPlatform.key,
    currentPlatform.key.split(".", 2)[0],
    currentPlatform.fallbackPlatform,
  ];

  let result: boolean | null = null;
  for (let platformKey, i = 0; (platformKey = platformsToSearch[i]); i++) {
    if (!platformKey) continue;
    result = isSupported(platformKey, supported, notSupported);
    if (result === false) return null;
    else if (result === true) break;
  }
  if (result === null && supported.length) return null;

  return <React.Fragment>{children}</React.Fragment>;
};
