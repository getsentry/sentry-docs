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
import {usePathname} from 'next/navigation';

import {PlatformIcon} from 'sentry-docs/components/platformIcon';
import {Platform, PlatformGuide, PlatformIntegration} from 'sentry-docs/types';
import {uniqByReference} from 'sentry-docs/utils';

import styles from './style.module.scss';

import {SidebarLink} from '../sidebarLink';

export function PlatformSelector({
  platforms,
  currentPlatform,
}: {
  platforms: Array<Platform>;
  currentPlatform?: Platform | PlatformGuide;
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
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const matches = useMemo(() => {
    if (!searchValue) {
      return platformsAndGuides;
    }
    // any of these fields can be used to match the search value
    const keys = ['title', 'name', 'aliases', 'sdk', 'keywords'];
    const matches_ = matchSorter(platformsAndGuides, searchValue, {keys});
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
    const platform_ = platformsAndGuides.find(platform => platform.key === platformKey);
    if (platform_) {
      localStorage.setItem('active-platform', platform_.key);
      // feels wrong to use window.location here,
      // but router.push is not working on mobile for some reason
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
    !isPlatformPage && storedPlatformKey && storedPlatform && path !== '/platforms/';

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
          <RadixSelect.Trigger aria-label="Platform" className={styles.select}>
            <RadixSelect.Value placeholder="Choose your SDK" />
            <RadixSelect.Icon className={styles['select-icon']}>
              <CaretSortIcon />
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
                // Ariakit's Combobox manually triggers a blur event on virtually
                // blurred items, making them work as if they had actual DOM
                // focus. These blur events might happen after the corresponding
                // focus events in the capture phase, leading Radix Select to
                // close the popover. This happens because Radix Select relies on
                // the order of these captured events to discern if the focus was
                // outside the element. Since we don't have access to the
                // onInteractOutside prop in the Radix SelectContent component to
                // stop this behavior, we can turn off Ariakit's behavior here.
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
                  // map guides to parent platforms
                  .map(x => (x.type === 'platform' ? x : x.platform))
              ).map(platform => {
                return (
                  <PlatformItem
                    key={platform.key}
                    platform={{
                      ...platform,
                      // only keep guides that are in the matches list
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
                        // expand search results
                        searchValue !== '' ||
                        expandedPlatforms.has(platform.key) ||
                        // expand current platform/parent of current guide
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
          </RadixSelect.Content>
        </ComboboxProvider>
      </RadixSelect.Root>
      {showStoredPlatform && (
        <div className={styles.toc}>
          <ul>
            <SidebarLink
              to={storedPlatform.url}
              title={`Sentry for ${storedPlatform.title ?? storedPlatform.key}`}
              path=""
              className={styles['active-platform-title']}
            >
              {/* display chevron icon by adding a child element */}
              <Fragment />
            </SidebarLink>
          </ul>
          <hr />
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
              value={platform.key}
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
