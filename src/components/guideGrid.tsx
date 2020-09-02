import React from "react";

import PlatformIcon from "./platformIcon";
import SmartLink from "./smartLink";
import { getPlatform, Platform } from "./hooks/usePlatform";

type Props = {
  platform: string;
};

export default ({ platform }: Props): JSX.Element => {
  const currentPlatform = getPlatform(platform) as Platform;

  return (
    <ul>
      {currentPlatform.guides.map(guide => (
        <li key={guide.key}>
          <SmartLink to={guide.url}>
            <PlatformIcon
              size={16}
              platform={guide.key}
              style={{ marginRight: "0.5rem" }}
            />
            <h4 style={{ display: "inline-block" }}>{guide.title}</h4>
          </SmartLink>
        </li>
      ))}
    </ul>
  );
};
