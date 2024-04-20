import {extractPlatforms} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

import styles from './styles.module.scss';

import {PlatformIcon} from '../platformIcon';
import {SmartLink} from '../smartLink';

export function PlatformGrid({noGuides = false}) {
  const {rootNode} = serverContext();
  if (!rootNode) {
    return null;
  }

  const platforms = extractPlatforms(rootNode);
  return (
    <div className={styles.PlatformGrid}>
      {platforms
        .sort((a, b) => (a.title || '').localeCompare(b.title || ''))
        .filter(platform => !platform.key.match('perl'))
        .map(platform => {
          return (
            <div className={styles.PlatformCell} key={platform.key}>
              <div className={styles.PlatformCellIcon}>
                <SmartLink to={platform.url}>
                  <PlatformIcon
                    size={82}
                    platform={platform.icon ?? platform.key}
                    format="lg"
                    style={{border: 0, boxShadow: 'none', borderRadius: '0.25rem'}}
                  />
                </SmartLink>
              </div>
              <div className={styles.PlatformCellContent}>
                <SmartLink to={platform.url}>
                  <h4>{platform.title}</h4>
                </SmartLink>

                {!noGuides && (
                  <div className={styles.GuideList}>
                    {platform.guides.map(guide => {
                      return (
                        <SmartLink to={guide.url} key={guide.key}>
                          {guide.title}
                        </SmartLink>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
