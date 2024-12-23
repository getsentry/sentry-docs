import {getPlatform} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

import {PlatformIcon} from './platformIcon';
import {SmartLink} from './smartLink';

type Props = {
  label?: string;
  platform?: string;
  url?: string;
};

export function PlatformLinkWithLogo({platform, label, url}: Props) {
  const {rootNode} = serverContext();
  if (!platform) {
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
