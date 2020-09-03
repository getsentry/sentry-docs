import React from "react";

import SmartLink from "./smartLink";

type Props = {
  to?: string;
  children: JSX.Element;
};

export default ({ children, to }: Props): JSX.Element => {
  let path = `/platform-redirect/`;
  if (to) path += `?next=${encodeURIComponent(to)}`;
  return <SmartLink to={path}>{children}</SmartLink>;
};
