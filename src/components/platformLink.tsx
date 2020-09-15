import React from "react";

import usePlatform from "./hooks/usePlatform";
import SmartLink from "./smartLink";

type Props = {
  to?: string;
  children: JSX.Element;
};

export default ({ children, to }: Props): JSX.Element => {
  const [currentPlatform] = usePlatform(null);
  let path = currentPlatform ? currentPlatform.url : `/platform-redirect/`;
  if (to)
    path += currentPlatform ? to.slice(1) : `?next=${encodeURIComponent(to)}`;
  return <SmartLink to={path}>{children}</SmartLink>;
};
