'use client';
import {Combobox, ComboboxItem, ComboboxList, ComboboxProvider} from '@ariakit/react';
import {CaretRightIcon, CaretSortIcon, MagnifyingGlassIcon} from '@radix-ui/react-icons';
import * as RadixSelect from '@radix-ui/react-select';
import {matchSorter} from 'match-sorter';
import {usePathname} from 'next/navigation';
import {
  Fragment,
  Ref,
  startTransition,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {PlatformIcon} from 'sentry-docs/components/platformIcon';
import {Platform, PlatformGuide, PlatformIntegration} from 'sentry-docs/types';
import {isLocalStorageAvailable, uniqByReference} from 'sentry-docs/utils';

import {SidebarLink, SidebarSeparator} from '../sidebar/sidebarLink';
import styles from './style.module.scss';

// Nested guides share their `key` with the same framework in other runtimes
const itemKey = (item: {key: string; id?: string}) => item.id ?? item.key;

const containsItem = (platform: Platform, key?: string) =>
  platform.key === key ||
  platform.guides.some(
    g => itemKey(g) === key || g.nestedGuides?.some(n => itemKey(n) === key)
  );

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
    title.replace(/\./g, ' ').replace(/ +/g, ' ').trim();
  const platformsAndGuides = useMemo(
    () =>
      platforms
        .slice()
        .sort(
          (a, b) =>
            humanizeTitle(a.title ?? '').localeCompare(
              humanizeTitle(b.title ?? ''),
              'en',
              {
                sensitivity: 'base',
              }
            ) ?? 0
        )
        .map(platform => [
          platform,
          ...platform.guides.flatMap(guide => [
            {
              ...guide,
              // add a reference to the parent platform instead of its key
              platform,
            },
            ...(guide.nestedGuides ?? []).map(nestedGuide => ({
              ...nestedGuide,
              platform,
            })),
          ]),
          ...platform.integrations.map(integration => ({
            ...integration,
            platform,
          })),
        ])
        .flat(2),
    [platforms]
  );

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

  const currentPlatformKey = currentPlatform && itemKey(currentPlatform);
  const pathname = usePathname();

  // Not auto-opened on /platforms/: Radix Select locks body scroll while open.
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
      lang => itemKey(lang) === currentPlatformKey
    );
    if (selectedPlatform && !matches_.includes(selectedPlatform)) {
      matches_.push(selectedPlatform);
    }
    return matches_;
  }, [searchValue, currentPlatformKey, platformsAndGuides]);

  // A guide stays in the list when one of its nested guides matches the search
  const matchedGuides = (platform: Platform) => {
    const matchIndex = (guide: PlatformGuide) =>
      matches.findIndex(m => itemKey(m) === itemKey(guide));
    const firstMatchIndex = (guide: PlatformGuide) =>
      Math.min(
        ...[guide, ...(guide.nestedGuides ?? [])].map(matchIndex).filter(i => i !== -1)
      );
    return platform.guides
      .map(guide => ({
        ...guide,
        nestedGuides: (guide.nestedGuides ?? []).filter(n => matchIndex(n) !== -1),
      }))
      .filter(
        guide =>
          guide.nestedGuides.length > 0 ||
          matches.some(m => itemKey(m) === itemKey(guide) && m.type === 'guide')
      )
      .sort((a, b) => firstMatchIndex(a) - firstMatchIndex(b));
  };

  const onPlatformChange = (platformKey: string) => {
    const platform_ = platformsAndGuides.find(
      platform => itemKey(platform) === platformKey.replace('-redirect', '')
    );
    if (platform_) {
      if (isLocalStorageAvailable()) {
        localStorage.setItem('active-platform', itemKey(platform_));
      }
      // Use hard navigation for faster page load
      window.location.href = platform_.url;
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

  // Track if component has mounted to prevent hydration mismatch
  // localStorage is only available on the client, so we must wait until
  // after hydration to render UI that depends on it
  // See: DOCS-7RD
  const [hasMounted, setHasMounted] = useState(false);
  const [storedPlatformKey, setStoredPlatformKey] = useState<string | null>(null);
  const storedPlatform = platformsAndGuides.find(
    platform => itemKey(platform) === storedPlatformKey
  );
  useLayoutEffect(() => {
    setHasMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!isLocalStorageAvailable()) {
      return;
    }
    if (currentPlatformKey) {
      localStorage.setItem('active-platform', currentPlatformKey);
    } else {
      setStoredPlatformKey(localStorage.getItem('active-platform'));
    }
  }, [currentPlatformKey]);

  const isPlatformPage = Boolean(
    pathname?.startsWith('/platforms/') &&
    // /platforms/something
    pathname.length > '/platforms/'.length
  );
  // Only show stored platform after mount to prevent hydration mismatch
  // Server doesn't have localStorage, so this must wait until client-side
  const showStoredPlatform =
    hasMounted &&
    !open &&
    !isPlatformPage &&
    storedPlatformKey &&
    storedPlatform &&
    pathname !== '/platforms/';

  if (listOnly) {
    return (
      <div
        className={styles.popover}
        style={{display: 'flex', flexDirection: 'column', height: '100%'}}
      >
        <div
          className={styles['combobox-wrapper']}
          style={{position: 'sticky', top: 0, zIndex: 2}}
        >
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
            matches.map(x => (x.type === 'platform' ? x : x.platform))
          ).map(platform => (
            <PlatformItem
              key={platform.key}
              platform={{
                ...platform,
                guides: matchedGuides(platform),
                integrations: platform.integrations.filter(i =>
                  matches.some(m => m.key === i.key)
                ),
                isExpanded:
                  searchValue !== '' ||
                  expandedPlatforms.has(platform.key) ||
                  platform.key === currentPlatformKey ||
                  containsItem(platform, currentPlatformKey) ||
                  containsItem(platform, storedPlatformKey ?? undefined),
              }}
              activeItemRef={
                containsItem(platform, currentPlatformKey) ? activeElementRef : null
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
                matches.map(x => (x.type === 'platform' ? x : x.platform))
              ).map(platform => {
                return (
                  <PlatformItem
                    key={platform.key}
                    platform={{
                      ...platform,
                      guides: matchedGuides(platform),
                      integrations: platform.integrations.filter(i =>
                        matches.some(m => m.key === i.key)
                      ),
                      isExpanded:
                        searchValue !== '' ||
                        expandedPlatforms.has(platform.key) ||
                        platform.key === currentPlatformKey ||
                        containsItem(platform, currentPlatformKey) ||
                        containsItem(platform, storedPlatformKey ?? undefined),
                    }}
                    activeItemRef={
                      containsItem(platform, currentPlatformKey) ? activeElementRef : null
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
          className={
            dropdownStyle
              ? 'block px-4 py-2 text-[var(--gray-12)] hover:bg-[var(--gray-3)] rounded text-[0.875rem] font-normal font-sans no-underline'
              : styles.item
          }
          data-platform-with-guides
          ref={activeItemRef}
          style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}}
          onClick={() => {
            if (typeof window !== 'undefined') {
              if (isLocalStorageAvailable()) {
                localStorage.setItem('active-platform', platform.key);
              }
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
          <Fragment key={itemKey(guide)}>
            <GuideItem guide={guide} dropdownStyle={dropdownStyle} listOnly />
            {nestedGuidesOf(guide).map(nestedGuide => (
              <GuideItem
                key={itemKey(nestedGuide)}
                guide={{...nestedGuide, isLastGuide: false}}
                parentTitle={guide.title}
                dropdownStyle={dropdownStyle}
                listOnly
              />
            ))}
          </Fragment>
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
              className={
                dropdownStyle
                  ? 'block px-4 py-2 text-[var(--gray-12)] hover:bg-[var(--gray-3)] rounded text-[0.875rem] font-normal font-sans no-underline'
                  : styles.item
              }
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
                disabled={containsItem(platform, activeItemKey)}
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
      {guides.map(guide => (
        <Fragment key={itemKey(guide)}>
          <GuideItem guide={guide} dropdownStyle={dropdownStyle} />
          {nestedGuidesOf(guide).map(nestedGuide => (
            <GuideItem
              key={itemKey(nestedGuide)}
              guide={{...nestedGuide, isLastGuide: false}}
              parentTitle={guide.title}
              dropdownStyle={dropdownStyle}
            />
          ))}
        </Fragment>
      ))}
    </Fragment>
  );
}

const nestedGuidesOf = (guide: PlatformGuide | PlatformIntegration) =>
  guide.type === 'guide' ? (guide.nestedGuides ?? []) : [];

type GuideItemProps = {
  guide: (PlatformGuide | PlatformIntegration) & {isLastGuide: boolean};
  dropdownStyle?: boolean;
  listOnly?: boolean;
  /** The title of the guide that contains this nested guide, for example `Node.js` */
  parentTitle?: string;
};
function GuideItem({
  guide,
  dropdownStyle = false,
  listOnly = false,
  parentTitle,
}: GuideItemProps) {
  const isNestedGuide = !!parentTitle;
  if (listOnly) {
    return (
      <div
        className={
          dropdownStyle
            ? 'block px-4 py-2 text-[var(--gray-12)] hover:bg-[var(--gray-3)] rounded text-[0.875rem] font-normal font-sans no-underline'
            : styles.item
        }
        data-guide
        data-nested-guide={isNestedGuide}
        data-last-guide={guide.type === 'guide' && guide.isLastGuide}
        style={{
          marginLeft: isNestedGuide ? '3rem' : '1.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={() => {
          if (typeof window !== 'undefined') {
            if (isLocalStorageAvailable()) {
              localStorage.setItem('active-platform', guide.key);
            }
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
      key={itemKey(guide)}
      value={itemKey(guide)}
      asChild
      className={
        dropdownStyle
          ? 'block px-4 py-2 text-[var(--gray-12)] hover:bg-[var(--gray-3)] rounded text-[0.875rem] font-normal font-sans no-underline'
          : styles.item
      }
      data-guide
      data-nested-guide={isNestedGuide}
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
            {isNestedGuide && (
              <span className={styles['nested-guide-parent']}>({parentTitle})</span>
            )}
          </span>
        </RadixSelect.ItemText>
      </ComboboxItem>
    </RadixSelect.Item>
  );
}
