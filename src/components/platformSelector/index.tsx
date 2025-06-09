'use client';
import {
  Fragment,
  Ref,
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Combobox, ComboboxItem, ComboboxList, ComboboxProvider} from '@ariakit/react';
import {CaretRightIcon, CaretSortIcon, MagnifyingGlassIcon} from '@radix-ui/react-icons';
import * as RadixSelect from '@radix-ui/react-select';
import {matchSorter} from 'match-sorter';
import {usePathname, useRouter} from 'next/navigation';

import {PlatformIcon} from 'sentry-docs/components/platformIcon';
import {Platform, PlatformGuide, PlatformIntegration} from 'sentry-docs/types';
import {uniqByReference} from 'sentry-docs/utils';

import styles from './style.module.scss';

import {SidebarLink, SidebarSeparator} from '../sidebar/sidebarLink';

export function PlatformSelector({
  platforms,
  currentPlatform,
  alwaysOpen = false,
  listOnly = false,
  dropdownStyle = false,
}: {
  platforms: Array<Platform>;
  alwaysOpen?: boolean;
  currentPlatform?: Platform | PlatformGuide;
  dropdownStyle?: boolean;
  listOnly?: boolean;
}) {
  // humanize the title for a more natural sorting
  const humanizeTitle = (title: string) =>
    title.replaceAll('.', ' ').replaceAll(/ +/g, ' ').trim();
  const platformsAndGuides = platforms
    .slice()
    .sort(
      (a, b) =>
        humanizeTitle(a.title ?? '').localeCompare(humanizeTitle(b.title ?? ''), 'en', {
          sensitivity: 'base',
        }) ?? 0
    )
    .map(platform => [
      platform,
      ...platform.guides.map(guide => ({
        ...guide,
        // add a reference to the parent platform instead of its key
        platform,
      })),
      ...platform.integrations.map(integration => ({
        ...integration,
        platform,
      })),
    ])
    .flat(2);

  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<string>>(new Set());

  const onToggleExpand = (platformKey: string) => {
    setExpandedPlatforms(prev => {
      const expanded = new Set(prev);
      if (expanded.has(platformKey)) {
        expanded.delete(platformKey);
      } else {
        expanded.add(platformKey);
      }
      return expanded;
    });
  };

  const currentPlatformKey = currentPlatform?.key;
  const [open, setOpen] = useState(alwaysOpen);
  const [searchValue, setSearchValue] = useState('');

  const matches = useMemo(() => {
    if (!searchValue) {
      return platformsAndGuides;
    }
    // any of these fields can be used to match the search value
    const keys = ['title', 'name', 'aliases', 'sdk', 'keywords'];
    const matches_ = matchSorter(platformsAndGuides, searchValue, {
      keys,
      threshold: matchSorter.rankings.ACRONYM,
    });
    // Radix Select does not work if we don't render the selected item, so we
    // make sure to include it in the list of matches.
    const selectedPlatform = platformsAndGuides.find(
      lang => lang.key === currentPlatformKey
    );
    if (selectedPlatform && !matches_.includes(selectedPlatform)) {
      matches_.push(selectedPlatform);
    }
    return matches_;
  }, [searchValue, currentPlatformKey, platformsAndGuides]);

  const router = useRouter();
  const onPlatformChange = (platformKey: string) => {
    const platform_ = platformsAndGuides.find(
      platform => platform.key === platformKey.replace('-redirect', '')
    );
    if (platform_) {
      localStorage.setItem('active-platform', platform_.key);
      router.push(platform_.url);
    }
  };

  const activeElementRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) {
      return;
    }
    // run the scrollIntoView in the next frame to ensure the element is rendered
    requestAnimationFrame(() => activeElementRef.current?.scrollIntoView());
  }, [open]);

  const [storedPlatformKey, setStoredPlatformKey] = useState<string | null>(null);
  const storedPlatform = platformsAndGuides.find(
    platform => platform.key === storedPlatformKey
  );
  useEffect(() => {
    if (currentPlatformKey) {
      localStorage.setItem('active-platform', currentPlatformKey);
    } else {
      setStoredPlatformKey(localStorage.getItem('active-platform'));
    }
  }, [currentPlatformKey]);

  const path = usePathname();
  const isPlatformPage = Boolean(
    path?.startsWith('/platforms/') &&
      // /platforms/something
      path.length > '/platforms/'.length
  );
  const showStoredPlatform =
    !open &&
    !isPlatformPage &&
    storedPlatformKey &&
    storedPlatform &&
    path !== '/platforms/';

  if (listOnly) {
    return (
      <div className={styles.popover} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <div className={styles['combobox-wrapper']} style={{position: 'sticky', top: 0, zIndex: 2}}>
          <div className={styles['combobox-icon']}>
            <MagnifyingGlassIcon />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Search platforms"
            className={styles.combobox}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
        <div className={styles.listbox} style={{flex: 1, overflowY: 'auto'}}>
          {uniqByReference(
            matches
              .map(x => (x.type === 'platform' ? x : x.platform))
          ).map(platform => (
            <PlatformItem
              key={platform.key}
              platform={{
                ...platform,
                guides: platform.guides
                  .filter(g =>
                    matches.some(m => m.key === g.key && m.type === 'guide')
                  )
                  .sort((a, b) => {
                    const indexA = matches.findIndex(m => m.key === a.key);
                    const indexB = matches.findIndex(m => m.key === b.key);
                    return indexA - indexB;
                  }),
                integrations: platform.integrations.filter(i =>
                  matches.some(m => m.key === i.key)
                ),
                isExpanded:
                  searchValue !== '' ||
                  expandedPlatforms.has(platform.key) ||
                  platform.key === currentPlatformKey ||
                  platform.key === storedPlatformKey ||
                  platform.guides.some(
                    g => g.key === currentPlatformKey || g.key === storedPlatformKey
                  ),
              }}
              activeItemRef={
                platform.key === currentPlatformKey ||
                platform.guides.some(g => g.key === currentPlatformKey)
                  ? activeElementRef
                  : null
              }
              activeItemKey={currentPlatformKey}
              onPlatformExpand={onToggleExpand}
              dropdownStyle={dropdownStyle}
              listOnly
            />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div>
      <RadixSelect.Root
        defaultValue={currentPlatformKey}
        value={showStoredPlatform ? storedPlatformKey : undefined}
        onValueChange={onPlatformChange}
        open={open}
        onOpenChange={setOpen}
      >
        <ComboboxProvider
          open={open}
          setOpen={setOpen}
          includesBaseElement={false}
          setValue={v => startTransition(() => setSearchValue(v))}
        >
          {!alwaysOpen && (
            <RadixSelect.Trigger aria-label="Platform" className={styles.select}>
              <RadixSelect.Value placeholder="Choose your SDK" />
              <RadixSelect.Icon className={styles['select-icon']}>
                <CaretSortIcon />
              </RadixSelect.Icon>
            </RadixSelect.Trigger>
          )}
          <RadixSelect.Content
            role="dialog"
            aria-label="Platforms"
            position="popper"
            className={styles.popover}
          >
            <div className={styles['combobox-wrapper']}>
              <div className={styles['combobox-icon']}>
                <MagnifyingGlassIcon />
              </div>
              <Combobox
                autoSelect
                placeholder="Search platforms"
                className={styles.combobox}
                onBlurCapture={event => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
            <ComboboxList className={styles.listbox}>
              {uniqByReference(
                matches
                  .map(x => (x.type === 'platform' ? x : x.platform))
              ).map(platform => {
                return (
                  <PlatformItem
                    key={platform.key}
                    platform={{
                      ...platform,
                      guides: platform.guides
                        .filter(g =>
                          matches.some(m => m.key === g.key && m.type === 'guide')
                        )
                        .sort((a, b) => {
                          const indexA = matches.findIndex(m => m.key === a.key);
                          const indexB = matches.findIndex(m => m.key === b.key);
                          return indexA - indexB;
                        }),
                      integrations: platform.integrations.filter(i =>
                        matches.some(m => m.key === i.key)
                      ),
                      isExpanded:
                        searchValue !== '' ||
                        expandedPlatforms.has(platform.key) ||
                        platform.key === currentPlatformKey ||
                        platform.key === storedPlatformKey ||
                        platform.guides.some(
                          g => g.key === currentPlatformKey || g.key === storedPlatformKey
                        ),
                    }}
                    activeItemRef={
                      platform.key === currentPlatformKey ||
                      platform.guides.some(g => g.key === currentPlatformKey)
                        ? activeElementRef
                        : null
                    }
                    activeItemKey={currentPlatformKey}
                    onPlatformExpand={onToggleExpand}
                    dropdownStyle={dropdownStyle}
                    listOnly={false}
                  />
                );
              })}
            </ComboboxList>
          </RadixSelect.Content>
        </ComboboxProvider>
      </RadixSelect.Root>
      {showStoredPlatform && (
        <div className="mt-3">
          <SidebarLink
            href={storedPlatform.url}
            title={`Sentry for ${storedPlatform.title ?? storedPlatform.key}`}
            collapsible
            topLevel
          />
          <SidebarSeparator />
        </div>
      )}
    </div>
  );
}

type PlatformItemProps = {
  activeItemRef: Ref<HTMLDivElement>;
  platform: Platform & {isExpanded?: boolean};
  activeItemKey?: string;
  dropdownStyle?: boolean;
  listOnly?: boolean;
  onPlatformExpand?: (platformKey: string) => void;
};
function PlatformItem({
  platform,
  activeItemRef,
  activeItemKey,
  onPlatformExpand: onExpand,
  dropdownStyle = false,
  listOnly = false,
}: PlatformItemProps) {
  const showCaret = (p: Platform) => p.guides.length > 0 || p.integrations.length > 0;

  const markLastGuide = (guides: Array<PlatformGuide | PlatformIntegration>) =>
    guides.map((guide, i) => ({
      ...guide,
      isLastGuide: i === guides.length - 1,
    }));

  // This is the case if `platformTitle` is configured for a platform
  // In this case, the top-level select item should get the `-redirect` suffix,
  // as we can't have two items with the same key
  const hasGuideWithPlatformKey = platform.guides.some(g => g.key === platform.key);

  const guides = platform.isExpanded
    ? markLastGuide(platform.guides.length > 0 ? platform.guides : platform.integrations)
    : [];

  if (listOnly) {
    return (
      <Fragment>
        <div
          className={dropdownStyle ? 'block px-4 py-2 text-[var(--gray-12)] hover:bg-[var(--gray-3)] rounded text-[0.875rem] font-normal font-sans no-underline' : styles.item}
          data-platform-with-guides
          ref={activeItemRef}
          style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}}
          onClick={() => {
            // mimic navigation
            if (typeof window !== 'undefined') {
              window.location.href = platform.url;
            }
          }}
        >
          <span className={dropdownStyle ? '' : styles['item-text']}>
            <PlatformIcon
              platform={platform.icon ?? platform.key}
              size={16}
              format="sm"
              className={styles['platform-icon']}
            />
            {platform.title}
          </span>
          {showCaret(platform) && (
            <button
              className={styles['expand-button']}
              type="button"
              tabIndex={-1}
              aria-label="Expand"
              style={{marginLeft: 'auto'}}
              onClick={e => {
                e.stopPropagation();
                onExpand?.(platform.key);
              }}
              data-expanded={platform.isExpanded}
            >
              <CaretRightIcon />
            </button>
          )}
        </div>
        {guides.map(guide => (
          <GuideItem key={guide.key} guide={guide} dropdownStyle={dropdownStyle} listOnly />
        ))}
      </Fragment>
    );
  }
  return (
    <Fragment>
      {/* This is a hack. The Label allows us to have a clickable button inside the item without triggering its selection */}
      <RadixSelect.Group>
        <RadixSelect.Label className="flex">
          <Fragment>
            <RadixSelect.Item
              value={hasGuideWithPlatformKey ? `${platform.key}-redirect` : platform.key}
              asChild
              className={dropdownStyle ? 'block px-4 py-2 text-[var(--gray-12)] hover:bg-[var(--gray-3)] rounded text-[0.875rem] font-normal font-sans no-underline' : styles.item}
              data-platform-with-guides
              ref={activeItemRef}
            >
              <ComboboxItem>
                <RadixSelect.ItemText>
                  <span className={dropdownStyle ? '' : styles['item-text']}>
                    <PlatformIcon
                      platform={platform.icon ?? platform.key}
                      size={16}
                      format="sm"
                      className={styles['platform-icon']}
                    />
                    {platform.title}
                  </span>
                </RadixSelect.ItemText>
              </ComboboxItem>
            </RadixSelect.Item>
            {showCaret(platform) && (
              <button
                className={styles['expand-button']}
                disabled={
                  activeItemKey === platform.key ||
                  platform.guides.some(g => g.key === activeItemKey)
                }
                onClick={() => {
                  onExpand?.(platform.key);
                }}
                data-expanded={platform.isExpanded}
              >
                <CaretRightIcon />
              </button>
            )}
          </Fragment>
        </RadixSelect.Label>
      </RadixSelect.Group>
      {guides.map(guide => {
        return <GuideItem key={guide.key} guide={guide} dropdownStyle={dropdownStyle} />;
      })}
    </Fragment>
  );
}

type GuideItemProps = {
  guide: (PlatformGuide | PlatformIntegration) & {isLastGuide: boolean};
  dropdownStyle?: boolean;
  listOnly?: boolean;
};
function GuideItem({guide, dropdownStyle = false, listOnly = false}: GuideItemProps) {
  if (listOnly) {
    return (
      <div
        className={dropdownStyle ? 'block px-4 py-2 text-[var(--gray-12)] hover:bg-[var(--gray-3)] rounded text-[0.875rem] font-normal font-sans no-underline' : styles.item}
        data-guide
        data-last-guide={guide.type === 'guide' && guide.isLastGuide}
        style={{marginLeft: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center'}}
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.location.href = guide.url;
          }
        }}
      >
        <span className={dropdownStyle ? '' : styles['item-text']}>
          <PlatformIcon
            platform={guide.icon ?? guide.key}
            size={16}
            format="sm"
            className={styles['platform-icon']}
          />
          {/* replace dots with zero width space + period to allow text wrapping before periods
            without breaking words in weird places
          */}
          {(guide.title ?? guide.name ?? guide.key).replace(/\./g, '\u200B.')}
        </span>
      </div>
    );
  }
  return (
    <RadixSelect.Item
      key={guide.key}
      value={guide.key}
      asChild
      className={dropdownStyle ? 'block px-4 py-2 text-[var(--gray-12)] hover:bg-[var(--gray-3)] rounded text-[0.875rem] font-normal font-sans no-underline' : styles.item}
      data-guide
      data-last-guide={guide.type === 'guide' && guide.isLastGuide}
    >
      <ComboboxItem>
        <RadixSelect.ItemText>
          <span className={dropdownStyle ? '' : styles['item-text']}>
            <PlatformIcon
              platform={guide.icon ?? guide.key}
              size={16}
              format="sm"
              className={styles['platform-icon']}
            />
            {/* replace dots with zero width space + period to allow text wrapping before periods
              without breaking words in weird places
            */}
            {(guide.title ?? guide.name ?? guide.key).replace(/\./g, '\u200B.')}
          </span>
        </RadixSelect.ItemText>
      </ComboboxItem>
    </RadixSelect.Item>
  );
}
