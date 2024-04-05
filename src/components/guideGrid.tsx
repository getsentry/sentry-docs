import {Fragment} from 'react';

import {getCurrentPlatform, getPlatform} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

import {PlatformIcon} from './platformIcon';
import {SmartLink} from './smartLink';

type Props = {
  className?: string;
  platform?: string;
};

export function GuideGrid({platform, className}: Props) {
  const {rootNode, path} = serverContext();
  if (!rootNode) {
    return null;
  }

  const currentPlatform = platform
    ? getPlatform(rootNode, platform)
    : getCurrentPlatform(rootNode, path);
  if (!currentPlatform) {
    return null;
  }

  if (currentPlatform.guides.length === 0) {
    return null;
  }

  return (
    <Fragment>
      <div className="doc-toc-title">
        <h6>Related Guides</h6>
      </div>
      <ul className={className}>
        {currentPlatform.guides.map(guide => (
          <li key={guide.key}>
            <SmartLink to={guide.url}>
              <PlatformIcon
                platform={(guide.icon ?? guide.key).replace(
                  currentPlatform.key,
                  currentPlatform.superFallbackPlatform ?? currentPlatform.key
                )}
                style={{marginRight: '0.5rem', border: 0, boxShadow: 'none'}}
                format="sm"
              />
              <h4 style={{display: 'inline-block'}}>{guide.title}</h4>
            </SmartLink>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}
