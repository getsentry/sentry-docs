'use client';
import {Combobox, ComboboxItem, ComboboxList, ComboboxProvider} from '@ariakit/react';
import {
  CaretRightIcon,
  CaretSortIcon,
  MagnifyingGlassIcon,
  UpdateIcon,
} from '@radix-ui/react-icons';
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
import {usePlatforms} from 'sentry-docs/hooks/usePlatforms';
import {Platform, PlatformGuide, PlatformIntegration} from 'sentry-docs/types';
import {isLocalStorageAvailable, uniqByReference} from 'sentry-docs/utils';

import {SidebarLink, SidebarSeparator} from '../sidebar/sidebarLink';
import {resolveSamePageUrl} from './samePageUrl';
import styles from './style.module.scss';

const NO_PLATFORMS: Platform[] = [];

/**
 * Shown below the list while the full list of platforms is loading or failed to load.
 */
function PlatformsListStatus({
  status,
  onRetry,
}: {
  onRetry: () => void;
  status: 'loading' | 'error';
}) {
  if (status === 'loading') {
    return (
      <div className={styles['list-status']} role="status">
        <UpdateIcon className="animate-spin" aria-hidden />
        Loading platforms…
      </div>
    );
  }
  return (
    <div className={styles['list-status']} role="alert">
      Couldn't load platforms.
      <button type="button" className={styles['retry-button']} onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export function PlatformSelector({
  currentPlatform,
  initialPlatforms = NO_PLATFORMS,
}: {
  currentPlatform?: Platform | PlatformGuide;
  /**
   * Rendered until the full list has loaded. Must contain the current platform or
   * guide, as Radix Select needs the selected item to display it in the trigger.
   */
  initialPlatforms?: Platform[];
}) {
  const {
    platforms: loadedPlatforms,
    status: platformsStatus,
    retry: retryPlatforms,
  } = usePlatforms();
  const platforms = useMemo(
    () => loadedPlatforms ?? initialPlatforms,
    [loadedPlatforms, initialPlatforms]
  );

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

  const currentPlatformKey = currentPlatform?.key;
  const pathname = usePathname();

  // Not auto-opened on /platforms/: Radix Select locks body scroll while open.
  const [open, setOpen] = useState(false);
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

  const onPlatformChange = (platformKey: string) => {
    const platform_ = platformsAndGuides.find(
      platform => platform.key === platformKey.replace('-redirect', '')
    );
    if (platform_) {
      if (isLocalStorageAvailable()) {
        localStorage.setItem('active-platform', platform_.key);
      }
      // Go to the same page for the selected platform if it exists. Finding it
      // can take a moment, so show that we're navigating in the meantime.
      setIsNavigating(true);
      resolveSamePageUrl(platform_, pathname ?? '').then(url => {
        // Use hard navigation for faster page load
        window.location.href = url;
      });
    }
  };

  const [isNavigating, setIsNavigating] = useState(false);
  useEffect(() => {
    // Reset when coming back to this page from the back/forward cache
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsNavigating(false);
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

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
    platform => platform.key === storedPlatformKey
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

  return (
    <div>
      <RadixSelect.Root
        defaultValue={currentPlatformKey}
        value={showStoredPlatform ? storedPlatformKey : undefined}
        onValueChange={onPlatformChange}
        open={open}
        onOpenChange={setOpen}
        disabled={isNavigating}
      >
        <ComboboxProvider
          open={open}
          setOpen={setOpen}
          includesBaseElement={false}
          setValue={v => startTransition(() => setSearchValue(v))}
        >
          <RadixSelect.Trigger
            aria-label="Platform"
            aria-busy={isNavigating}
            className={styles.select}
          >
            <RadixSelect.Value placeholder="Choose your SDK" />
            <RadixSelect.Icon className={styles['select-icon']}>
              {isNavigating ? <UpdateIcon className="animate-spin" /> : <CaretSortIcon />}
            </RadixSelect.Icon>
          </RadixSelect.Trigger>
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
                  />
                );
              })}
            </ComboboxList>
            {platformsStatus !== 'loaded' && (
              <PlatformsListStatus status={platformsStatus} onRetry={retryPlatforms} />
            )}
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
  onPlatformExpand?: (platformKey: string) => void;
};
function PlatformItem({
  platform,
  activeItemRef,
  activeItemKey,
  onPlatformExpand: onExpand,
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

  return (
    <Fragment>
      {/* This is a hack. The Label allows us to have a clickable button inside the item without triggering its selection */}
      <RadixSelect.Group>
        <RadixSelect.Label className="flex">
          <Fragment>
            <RadixSelect.Item
              value={hasGuideWithPlatformKey ? `${platform.key}-redirect` : platform.key}
              asChild
              className={styles.item}
              data-platform-with-guides
              ref={activeItemRef}
            >
              <ComboboxItem>
                <RadixSelect.ItemText>
                  <span className={styles['item-text']}>
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
        return <GuideItem key={guide.key} guide={guide} />;
      })}
    </Fragment>
  );
}

type GuideItemProps = {
  guide: (PlatformGuide | PlatformIntegration) & {isLastGuide: boolean};
};
function GuideItem({guide}: GuideItemProps) {
  return (
    <RadixSelect.Item
      key={guide.key}
      value={guide.key}
      asChild
      className={styles.item}
      data-guide
      data-last-guide={guide.type === 'guide' && guide.isLastGuide}
    >
      <ComboboxItem>
        <RadixSelect.ItemText>
          <span className={styles['item-text']}>
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
