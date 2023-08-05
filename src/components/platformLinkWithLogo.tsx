import React from 'react';
import {PlatformIcon} from 'platformicons';

import {usePlatform} from './hooks/usePlatform';
import {SmartLink} from './smartLink';

type Props = {
  label?: string;
  platform?: string;
  url?: string;
};

export function PlatformLinkWithLogo({platform, label, url}: Props) {
  const [currentPlatform] = usePlatform(platform);

  if (currentPlatform.type !== 'platform') {
    return null;
  }

  return (
    <SmartLink to={url}>
      <PlatformIcon
        size={20}
        platform={currentPlatform.key}
        style={{
          marginRight: '0.5rem',
          marginTop: '0.2rem',
          border: 0,
          boxShadow: 'none',
        }}
        format="sm"
      />
      {label ?? currentPlatform.title}
    </SmartLink>
  );
}
