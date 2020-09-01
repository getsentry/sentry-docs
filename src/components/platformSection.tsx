import React from "react";

import usePlatform from "./hooks/usePlatform";

type Props = {
  supported?: string[];
  notSupported?: string[];
  platform?: string;
  children?: React.ReactNode;
};

export default ({
  supported = [],
  notSupported = [],
  platform,
  children,
}: Props): JSX.Element => {
  const [currentPlatform] = usePlatform(platform);

  let isSupported = !supported.length;
  if (currentPlatform) {
    const [platformName, guideName] = currentPlatform.key.split(".", 2);
    if (supported.length && supported.find(p => p === currentPlatform.key)) {
      isSupported = true;
    } else if (
      notSupported.length &&
      notSupported.find(p => p === currentPlatform.key)
    ) {
      isSupported = false;
    } else if (guideName) {
      if (supported.length && supported.find(p => p === platformName)) {
        isSupported = true;
      } else if (
        notSupported.length &&
        notSupported.find(p => p === platformName)
      ) {
        isSupported = false;
      }
    }
  }

  if (!isSupported) return null;

  return <React.Fragment>{children}</React.Fragment>;
};
