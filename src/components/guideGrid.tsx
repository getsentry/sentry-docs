import React from "react";
import styled from "@emotion/styled";

import PlatformIcon from "./platformIcon";
import SmartLink from "./smartLink";
import { getPlatform, Platform } from "./hooks/usePlatform";

const GuideCell = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-direction: column;

  background: #fff;
  color: purple;
  border: 1px solid #fff;
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;
  line-height: 1.5;
  transition-property: transform, box-shadow, border-color;
  transition-duration: 0.25s;
  transition-timing-function: ease-out;
  box-shadow: 0px 2px 4px rgba(64, 30, 76, 0.1);

  a {
    text-align: center;
  }

  h4 {
    margin: 0.5rem 0 0;
    text-align: center;
  }
`;

type Props = {
  platform: string;
};

export default ({ platform }: Props): JSX.Element => {
  const currentPlatform = getPlatform(platform) as Platform;

  return (
    <div className="row">
      {currentPlatform.guides.map(guide => (
        <div
          className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-3"
          key={guide.key}
        >
          <GuideCell>
            <SmartLink to={guide.url}>
              <PlatformIcon size={36} platform={guide.key} />
              <h4>{guide.title}</h4>
            </SmartLink>
          </GuideCell>
        </div>
      ))}
    </div>
  );
};
