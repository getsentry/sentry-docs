import React from "react";
import { PlatformIcon } from "platformicons";

import SmartLink from "./smartLink";
import usePlatform, { Platform, Guide } from "./hooks/usePlatform";

type Props = {
  platform?: string;
  guide?: string;
  className?: string;
};

export default ({ platform, guide, className }: Props): JSX.Element => {
  const [currentPlatform] = usePlatform(platform);
  const currentGuide = (currentPlatform as Platform).guides.find(
    (g: Guide) => g.name === guide
  );
  // platform might actually not be a platform, so lets handle that case gracefully
  if (!(currentPlatform as Platform).guides) {
    return null;
  }

  // If guide does not exist
  if (!currentGuide) {
    return null;
  }

  return (
    <span className={className}>
      <SmartLink to={currentGuide.url}>
        <PlatformIcon
          size={16}
          platform={currentGuide.key}
          style={{ marginRight: "0.5rem", border: 0, boxShadow: "none" }}
          format="lg"
        />
        <h4 style={{ display: "inline-block" }}>{currentGuide.title}</h4>
      </SmartLink>
    </span>
  );
};
