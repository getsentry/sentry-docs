'use client';
import {useMemo, useState} from 'react';
import {matchSorter} from 'match-sorter';

import {type Platform, PlatformGuide} from 'sentry-docs/types';

import styles from './style.module.scss';

import {PlatformIcon} from '../platformIcon';
import {SmartLink} from '../smartLink';

export function PlatformFilter({platforms}: {platforms: Platform[]}) {
  const platformsAndGuides: (Platform | PlatformGuide)[] = platforms
    .map(p => [p, p.guides])
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
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8 md:items-end">
        <div className="lg:col-span-2 space-y-2">
          <h2 className="text-2xl font-medium">Choose your SDK</h2>
          <p className="m-0">If you use it, we probably support it.</p>
        </div>
        <div className="w-full flex justify-end">
          <input
            placeholder="Filter platforms"
            className={`${styles.input}`}
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
        {matches.length > 0 &&
          matches.map(platform => (
            <SmartLink
              to={platform.url}
              className="text-black hover:no-underline"
              key={platform.key}
            >
              <div className="flex gap-2 shadow hover:shadow-accent-purple/30 rounded p-2">
                <div className="w-5 flex">
                  <PlatformIcon
                    size={20}
                    platform={platform.icon ?? platform.key}
                    format="lg"
                  />
                </div>
                {platform.title}
              </div>
            </SmartLink>
          ))}
        {!matches.length && (
          <div className="col-span-3 text-center text-gray-600">
            No results found for query: "<code>{filter}</code>"
          </div>
        )}
      </div>
    </div>
  );
}
