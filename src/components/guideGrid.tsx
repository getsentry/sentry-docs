import React from 'react';
import {PlatformIcon} from 'platformicons';

import {usePlatform} from './hooks/usePlatform';
import {SmartLink} from './smartLink';

type Props = {
  className?: string;
  platform?: string;
};

export function GuideGrid({platform, className}: Props) {
  const [currentPlatform] = usePlatform(platform);

  if (currentPlatform.type === 'guide') {
    return null;
  }

  return (
    <ul className={className}>
      {currentPlatform.guides.map(guide => (
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
