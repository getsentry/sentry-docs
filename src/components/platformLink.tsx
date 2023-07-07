import React from 'react';

import {usePlatform} from './hooks/usePlatform';
import {SmartLink} from './smartLink';

type Props = {
  children: JSX.Element;
  to?: string;
};

export function PlatformLink({children, to}: Props) {
  const [currentPlatform] = usePlatform(null);
  let path = currentPlatform ? currentPlatform.url : `/platform-redirect/`;
  if (to) {
    path += currentPlatform ? to.slice(1) : `?next=${encodeURIComponent(to)}`;
  }
  return <SmartLink to={path}>{children}</SmartLink>;
}
