import React from "react";

import usePlatform, { formatCaseStyle } from "./hooks/usePlatform";
import PlatformSection from "./platformSection";

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
        <code>{formatCaseStyle(currentPlatform.caseStyle, name)}</code>
      </h3>

      {children}
    </PlatformSection>
  );
};
