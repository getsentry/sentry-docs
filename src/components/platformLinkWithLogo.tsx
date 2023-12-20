import React from 'react';
import {PlatformIcon} from 'platformicons';

import {SmartLink} from './smartLink';
import { serverContext } from 'sentry-docs/serverContext';
import { getPlatform } from 'sentry-docs/docTree';

type Props = {
  label?: string;
  platform?: string;
  url?: string;
};

export function PlatformLinkWithLogo({platform, label, url}: Props) {
  const { rootNode } = serverContext();
  if (!rootNode || !platform) {
    return null;
  }

  const currentPlatform = getPlatform(rootNode, platform);
  if (!currentPlatform) {
    return null;
  }

  if (currentPlatform.type !== 'platform') {
    return null;
  }

  return (
    <SmartLink to={url}>
      <PlatformIcon
        size={20}
        platform={currentPlatform.icon ?? currentPlatform.key}
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
