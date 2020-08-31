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
  const isSupported = notSupported.length
    ? !notSupported.find(
        p =>
          p === currentPlatform.key &&
          p !== currentPlatform.key.split(".", 1)[0]
      )
    : supported.length
    ? supported.find(
        p =>
          p === currentPlatform.key ||
          p === currentPlatform.key.split(".", 1)[0]
      )
    : true;

  if (!isSupported) return null;

  return <React.Fragment>{children}</React.Fragment>;
};
