'use client';
import {startTransition, useEffect, useMemo, useRef, useState} from 'react';
import {Combobox, ComboboxItem, ComboboxList, ComboboxProvider} from '@ariakit/react';
import {CaretSortIcon, MagnifyingGlassIcon} from '@radix-ui/react-icons';
import * as RadixSelect from '@radix-ui/react-select';
import {matchSorter} from 'match-sorter';
import {useRouter} from 'next/navigation';

import {PlatformIcon} from 'sentry-docs/components/platformIcon';
import {Platform, PlatformGuide} from 'sentry-docs/types';

import styles from './style.module.scss';

export function PlatformSelector({
  platforms,
  currentPlatform,
}: {
  platforms: Array<Platform>;
  currentPlatform?: Platform | PlatformGuide;
}) {
  // append guides to each platform
  const platformsAndGuides = platforms
    .map(platform => [
      platform,
      platform.guides.map((guide, i) => ({
        ...guide,
        isLastGuide: i === platform.guides.length - 1,
      })),
    ])
    .flat(2);
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
        resetValueOnHide
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
            {matches.map(platform => (
              <RadixSelect.Item
                key={platform.key}
                value={platform.key}
                asChild
                className={styles.item}
                data-guide={searchValue === '' && platform.type === 'guide'}
                data-last-guide={platform.type === 'guide' && platform.isLastGuide}
                ref={platform.key === currentPlatformKey ? activeElementRef : null}
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
            ))}
          </ComboboxList>
        </RadixSelect.Content>
      </ComboboxProvider>
    </RadixSelect.Root>
  );
}
