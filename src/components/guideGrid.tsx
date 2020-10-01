import React from "react";
import PlatformIcon from "platformicons";

import SmartLink from "./smartLink";
import { getPlatform, Platform } from "./hooks/usePlatform";

type Props = {
  platform: string;
};

export default ({ platform }: Props): JSX.Element => {
  const currentPlatform = getPlatform(platform) as Platform;
  // platform might actually not be a platform, so lets handle that case gracefully
  if (!currentPlatform.guides) {
    return null;
  }

  return (
    <ul>
      {currentPlatform.guides.map(guide => (
        <li key={guide.key}>
          <SmartLink to={guide.url}>
            <PlatformIcon
              size={16}
              platform={guide.key}
              style={{ marginRight: "0.5rem" }}
              format="lg"
            />
            <h4 style={{ display: "inline-block" }}>{guide.title}</h4>
          </SmartLink>
        </li>
      ))}
    </ul>
  );
};
