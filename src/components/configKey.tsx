import React from "react";

import usePlatform  from "./hooks/usePlatform";
import PlatformSection from "./platformSection";
import PlatformIdentifier from "./platformIdentifier";

type Props = {
  name: string;
  supported?: string[];
  notSupported?: string[];
  children?: React.ReactNode;
  platform?: string;
};

export default ({
  name,
  supported = [],
  notSupported = [],
  children,
  platform,
}: Props): JSX.Element => {
  const [currentPlatform] = usePlatform(platform);

  return (
    <PlatformSection
      supported={supported}
      notSupported={notSupported}
      platform={platform}
    >
      <h3>
        <PlatformIdentifier platform={platform} name={name} />
      </h3>

      {children}
    </PlatformSection>
  );
};
