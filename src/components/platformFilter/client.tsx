'use client';
import {useMemo, useState} from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import {TriangleRightIcon} from '@radix-ui/react-icons';
import classNames from 'classnames';
import {matchSorter, rankings} from 'match-sorter';
import Link from 'next/link';

import {type Platform} from 'sentry-docs/types';
import {splitToChunks, uniqByReference} from 'sentry-docs/utils';

import styles from './style.module.scss';

import {PlatformIcon} from '../platformIcon';

const mostViewedPlatforms: {icon: string; key: string; title: string; url: string}[] = [
  {
    url: '/platforms/javascript/guides/nextjs/',
    key: 'javascript-nextjs',
    icon: 'javascript-nextjs',
    title: 'Next.js',
  },
  {
    url: '/platforms/javascript/guides/react/',
    key: 'javascript-react',
    icon: 'javascript-react',
    title: 'React',
  },
  {
    url: 'platforms/php/guides/laravel/',
    key: 'php-laravel',
    icon: 'php-laravel',
    title: 'Laravel',
  },
  {
    url: '/platforms/javascript/guides/node/',
    key: 'node',
    icon: 'javascript-node',
    title: 'Node.js',
  },
  {url: '/platforms/python/', key: 'python', icon: 'python', title: 'Python'},
  {
    url: '/platforms/react-native/',
    key: 'react-native',
    icon: 'react-native',
    title: 'React Native',
  },
];

export function PlatformFilterClient({platforms}: {platforms: Platform[]}) {
  const platformsAndGuides = platforms
    .map(p => [
      p,
      p.guides.map(g => ({...g, platform: p})),
      p.integrations.map(integ => ({...integ, platform: p})),
    ])
    .flat(2);
  const [filter, setFilter] = useState('');

  const matches = useMemo(() => {
    if (!filter) {
      return platformsAndGuides;
    }
    // any of these fields can be used to match the search value
    const keys = ['title', 'aliases', 'name', 'sdk', 'keywords'];
    const matches_ = matchSorter(platformsAndGuides, filter, {
      keys,
      threshold: rankings.CONTAINS,
    });
    return matches_;
  }, [filter, platformsAndGuides]);

  const platformColumns: Platform[][] = splitToChunks(
    3,
    uniqByReference(matches.map(x => (x.type === 'platform' ? x : x.platform))).map(p => {
      return {
        ...p,
        guides: matches
          .filter(m => m.type === 'guide' && m.platform.key === p.key)
          .map(m => p.guides.find(g => g.key === m.key)!)
          .filter(Boolean),
        integrations: p.integrations.filter(i => matches.some(m => m.key === i.key)),
      };
    })
  );

  return (
    <div>
      {/* TODO: Refactor a more elegant solution for this top grid, this was thrown together quickly for https://github.com/getsentry/projects/issues/548 */}
      <div style={{marginBottom: '40px'}}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-8 md:items-end">
          <div className="lg:col-span-2 space-y-2">
            <h2 className="text-2xl font-medium">Most Viewed Sentry SDKs</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mostViewedPlatforms.map(platform => (
            <div className={`flex flex-col gap-4 ${styles.platform}`} key={platform.key}>
              <Link
                href={platform.url}
                key={platform.key}
                style={{
                  textDecoration: 'none',
                  color: 'var(--foreground) !important',
                }}
              >
                <div className={styles.StandalonePlatform}>
                  <PlatformIcon
                    size={20}
                    platform={platform.icon ?? platform.key}
                    format="lg"
                    className={`${styles.PlatformIcon} !border-none !shadow-none`}
                  />
                  {platform.title}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-8 md:items-end">
        <div className="lg:col-span-2 space-y-2">
          <h2 className="text-2xl font-medium">All SDKs Supported by Sentry</h2>
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
      {matches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platformColumns.map((column, i) => (
            <div key={i} className={`flex flex-col gap-4 ${styles.platform}`}>
              {column.map(platform =>
                platform.guides.length === 0 && platform.integrations.length === 0 ? (
                  <Link
                    href={platform.url}
                    key={platform.key}
                    style={{
                      textDecoration: 'none',
                      color: 'var(--foreground) !important',
                    }}
                  >
                    <div className={styles.StandalonePlatform}>
                      <PlatformIcon
                        size={20}
                        platform={platform.icon ?? platform.key}
                        format="lg"
                        className={`${styles.PlatformIcon} !border-none !shadow-none`}
                      />
                      {platform.title}
                    </div>
                  </Link>
                ) : (
                  <PlatformWithGuides
                    key={platform.key}
                    platform={platform}
                    // force expand if the filter is long enough to have few results
                    forceExpand={filter.length >= 2}
                  />
                )
              )}
            </div>
          ))}
        </div>
      )}
      {!matches.length && (
        <div className="col-span-3 text-center text-gray-600">No SDKs found</div>
      )}
    </div>
  );
}

function PlatformWithGuides({
  platform,
  forceExpand,
}: {
  forceExpand: boolean;
  platform: Platform;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Collapsible.Root
      className={styles.CollapsibleRoot}
      open={forceExpand || expanded}
      onOpenChange={setExpanded}
    >
      <Collapsible.Trigger asChild className={classNames(styles.CollapsibleTrigger)}>
        <div>
          <div className={styles.PlatformTitle} key={platform.key}>
            <PlatformIcon
              size={20}
              platform={platform.icon ?? platform.key}
              format="lg"
              className={`${styles.PlatformIcon} !border-none !shadow-none`}
            />
            {platform.title}
          </div>
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
      <Collapsible.Content
        className={classNames(styles.CollapsibleContent)}
        // scrollable if there are more than 8 (arbitrary limit) guides
        data-scrollable={platform.guides.length >= 8 || platform.integrations.length >= 8}
      >
        {[platform, ...platform.guides].map((guide, i) => (
          <Link
            href={guide.url}
            style={{textDecoration: 'none', color: 'var(--foreground) !important'}}
            key={guide.key}
          >
            <div
              className={styles.Guide}
              style={{
                animationDelay: `${i * 5}ms`,
              }}
            >
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
        {platform.guides.length === 0 &&
          platform.integrations.map((integ, i) => {
            return (
              <Link href={integ.url} key={integ.key}>
                <div
                  className={styles.Guide}
                  style={{
                    animationDelay: `${i * 5}ms`,
                  }}
                >
                  <PlatformIcon
                    size={20}
                    format="lg"
                    platform={integ.icon}
                    className={styles.Platform}
                  />
                  {integ.name}
                </div>
              </Link>
            );
          })}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
