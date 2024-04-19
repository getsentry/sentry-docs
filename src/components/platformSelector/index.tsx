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
import {useRouter} from 'next/navigation';

import {PlatformIcon} from 'sentry-docs/components/platformIcon';
import {Platform, PlatformGuide} from 'sentry-docs/types';
import {uniqByReference} from 'sentry-docs/utils';

import styles from './style.module.scss';

export function PlatformSelector({
  platforms,
  currentPlatform,
}: {
  platforms: Array<Platform>;
  currentPlatform?: Platform | PlatformGuide;
}) {
  const platformsAndGuides = platforms
    .map(platform => [
      platform,
      ...platform.guides.map(guide => ({
        ...guide,
        // add a reference to the parent platform instead of its key
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
  const router = useRouter();

  const matches = useMemo(() => {
    if (!searchValue) {
      return platformsAndGuides;
    }
    // any of these fields can be used to match the search value
    const keys = ['title', 'aliases', 'sdk'];
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
  }, [searchValue, currentPlatformKey]);

  const onPlatformChange = (platformKey: string) => {
    const url = platformsAndGuides.find(platform => platform.key === platformKey)?.url;
    if (url) {
      router.push(url);
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

  return (
    <RadixSelect.Root
      value={currentPlatformKey}
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
          <RadixSelect.Value placeholder="Choose your platform" />
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
                    guides: platform.guides.filter(g =>
                      matches.some(m => m.key === g.key)
                    ),
                    isExpanded:
                      // expand search results
                      searchValue !== '' ||
                      expandedPlatforms.has(platform.key) ||
                      // expand current platform/parent of current guide
                      platform.key === currentPlatformKey ||
                      platform.guides.some(g => g.key === currentPlatformKey),
                  }}
                  activeElementRef={
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
  );
}

type PlatformItemProps = {
  activeElementRef: Ref<HTMLDivElement>;
  platform: Platform & {isExpanded?: boolean};
  activeItemKey?: string;
  onPlatformExpand?: (platformKey: string) => void;
};
function PlatformItem({
  platform,
  activeElementRef: activeItemRef,
  activeItemKey: activeElementKey,
  onPlatformExpand: onExpand,
}: PlatformItemProps) {
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
              ref={activeElementKey === platform.key ? activeItemRef : null}
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
                    {platform.title?.replace(/(.)\.(.)/g, '$1 $2')}
                  </span>
                </RadixSelect.ItemText>
              </ComboboxItem>
            </RadixSelect.Item>
            {platform.guides.length > 0 && (
              <button
                className={styles['expand-button']}
                disabled={
                  activeElementKey === platform.key ||
                  platform.guides.some(g => g.key === activeElementKey)
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
      {platform.isExpanded &&
        platform.guides
          .map((guide, i) => ({
            ...guide,
            isLastGuide: i === platform.guides.length - 1,
          }))
          .map(guide => {
            const _ref = guide.key === activeElementKey ? activeItemRef : null;
            return <GuideItem key={guide.key} guide={guide} ref={_ref} />;
          })}
    </Fragment>
  );
}

type GuideItemProps = {
  guide: (PlatformGuide & {isLastGuide: boolean}) | Platform;
  ref: Ref<HTMLDivElement>;
};
function GuideItem({guide, ref}: GuideItemProps) {
  return (
    <RadixSelect.Item
      key={guide.key}
      value={guide.key}
      asChild
      className={styles.item}
      data-guide
      data-last-guide={guide.type === 'guide' && guide.isLastGuide}
      ref={ref}
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
            {guide.title?.replace(/(.)\.(.)/g, '$1 $2')}
          </span>
        </RadixSelect.ItemText>
      </ComboboxItem>
    </RadixSelect.Item>
  );
}
