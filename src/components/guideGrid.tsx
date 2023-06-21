import React from 'react';
import {PlatformIcon} from 'platformicons';

import {Platform, usePlatform} from './hooks/usePlatform';
import {SmartLink} from './smartLink';

type Props = {
  className?: string;
  platform?: string;
};

export function GuideGrid({platform, className}: Props): JSX.Element {
  const [currentPlatform] = usePlatform(platform);
  // platform might actually not be a platform, so lets handle that case gracefully
  if (!(currentPlatform as Platform).guides) {
    return null;
  }

  return (
    <ul className={className}>
      {(currentPlatform as Platform).guides.map(guide => (
        <li key={guide.key}>
          <SmartLink to={guide.url}>
            <PlatformIcon
              platform={guide.key}
              style={{marginRight: '0.5rem', border: 0, boxShadow: 'none'}}
              format="sm"
            />
            <h4 style={{display: 'inline-block'}}>{guide.title}</h4>
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}
