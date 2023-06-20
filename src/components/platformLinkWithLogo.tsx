import React from 'react';
import {PlatformIcon} from 'platformicons';

import {Platform, usePlatform} from './hooks/usePlatform';
import {SmartLink} from './smartLink';

type Props = {
  label?: string;
  platform?: string;
  url?: string;
};

export function PlatformLinkWithLogo({platform, label, url}: Props): JSX.Element {
  const [currentPlatform] = usePlatform(platform);
  let linkText = currentPlatform.title;

  // platform might actually not be a platform, so lets handle that case gracefully
  if (!(currentPlatform as Platform).guides) {
    return null;
  }

  if (label) {
    linkText = label;
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
      {linkText}
    </SmartLink>
  );
}
