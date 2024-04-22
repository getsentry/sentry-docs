'use client';
import {useMemo, useState} from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import {TriangleRightIcon} from '@radix-ui/react-icons';
import classNames from 'classnames';
import {matchSorter} from 'match-sorter';
import Link from 'next/link';

import {type Platform} from 'sentry-docs/types';
import {uniqByReference} from 'sentry-docs/utils';

import styles from './style.module.scss';

import {PlatformIcon} from '../platformIcon';

export function PlatformFilter({platforms}: {platforms: Platform[]}) {
  const platformsAndGuides = platforms
    .map(p => [p, p.guides.map(g => ({...g, platform: p}))])
    .flat(2);
  const [filter, setFilter] = useState('');

  const matches = useMemo(() => {
    if (!filter) {
      return platformsAndGuides;
    }
    // any of these fields can be used to match the search value
    const keys = ['title', 'aliases', 'sdk'];
    const matches_ = matchSorter(platformsAndGuides, filter, {keys});
    return matches_;
  }, [filter]);
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8 md:items-end">
        <div className="lg:col-span-2 space-y-2">
          <h2 className="text-2xl font-medium">Choose your SDK</h2>
          <p className="m-0">If you use it, we probably support it.</p>
        </div>
        <div className="w-full flex justify-end">
          <input
            placeholder="Search SDKs"
            className={`${styles.input}`}
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8 items-start">
        {matches.length > 0 &&
          uniqByReference(matches.map(x => (x.type === 'platform' ? x : x.platform)))
            .map(p => {
              return {
                ...p,
                guides: p.guides.filter(g => matches.some(m => m.key === g.key)),
              };
            })
            .map(platform =>
              platform.guides.length === 0 ? (
                <Link href={platform.url} key={platform.key}>
                  <div className={styles.StandalonePlatform}>
                    <PlatformIcon
                      size={20}
                      platform={platform.icon ?? platform.key}
                      format="lg"
                      className={styles.PlatformIcon}
                    />
                    {platform.title}
                  </div>
                </Link>
              ) : (
                <PlatformWithGuides key={platform.key} platform={platform} />
              )
            )}
        {!matches.length && (
          <div className="col-span-3 text-center text-gray-600">No results found</div>
        )}
      </div>
    </div>
  );
}

function PlatformWithGuides({platform}: {platform: Platform}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Collapsible.Root
      className={styles.CollapsibleRoot}
      open={expanded}
      onOpenChange={setExpanded}
    >
      <Collapsible.Trigger asChild className={classNames(styles.CollapsibleTrigger)}>
        <div>
          <Link href={platform.url} key={platform.key}>
            <div className={styles.PlatformTitle}>
              <PlatformIcon
                size={20}
                platform={platform.icon ?? platform.key}
                format="lg"
                className={styles.PlatformIcon}
              />
              {platform.title}
            </div>
          </Link>
          <button className={styles.ChevronButton}>
            <TriangleRightIcon
              className={styles.CollapsibleChevron}
              aria-hidden
              width="20"
              height="20"
            />
          </button>
        </div>
      </Collapsible.Trigger>
      <Collapsible.Content className={classNames(styles.CollapsibleContent)}>
        <div className={styles.CollapsibleContentText}>
          {platform.guides.map(guide => (
            <Link href={guide.url} key={guide.key}>
              <div className={styles.Guide}>
                <PlatformIcon
                  size={20}
                  platform={guide.icon ?? guide.key}
                  format="lg"
                  className={styles.PlatformIcon}
                />
                {guide.title}
              </div>
            </Link>
          ))}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
