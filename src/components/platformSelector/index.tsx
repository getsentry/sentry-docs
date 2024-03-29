import {startTransition, useEffect, useMemo, useState} from 'react';
import {Combobox, ComboboxItem, ComboboxList, ComboboxProvider} from '@ariakit/react';
import {CaretSortIcon, CheckIcon, MagnifyingGlassIcon} from '@radix-ui/react-icons';
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
  platforms: Array<Platform | PlatformGuide>;
  currentPlatform?: Platform | PlatformGuide;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentPlatform?.name ?? '');
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  useEffect(() => {
    const url = platforms.find(platform => platform.name === value)?.url;
    if (url) {
      router.push(url);
    }
  }, [value, platforms, router]);

  const matches = useMemo(() => {
    if (!searchValue) {
      return platforms;
    }
    // any of these fields can be used to match the search value
    const keys = ['name', 'aliases', 'sdk'];
    const matches_ = matchSorter(platforms, searchValue, {keys});
    // Radix Select does not work if we don't render the selected item, so we
    // make sure to include it in the list of matches.
    const selectedPlatform = platforms.find(lang => lang.name === value);
    if (selectedPlatform && !matches_.includes(selectedPlatform)) {
      matches_.push(selectedPlatform);
    }
    return matches_;
  }, [searchValue, value]);

  return (
    <RadixSelect.Root
      value={value}
      onValueChange={setValue}
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
          <RadixSelect.Value placeholder="Filter platforms" />
          <RadixSelect.Icon className={styles['select-icon']}>
            <CaretSortIcon />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Content
          role="dialog"
          aria-label="Platforms"
          position="popper"
          className={styles.popover}
          sideOffset={4}
          alignOffset={-16}
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
                value={platform.name}
                asChild
                className={styles.item}
              >
                <ComboboxItem>
                  <RadixSelect.ItemText>
                    <span className={styles['item-text']}>
                      <PlatformIcon
                        platform={platform.icon ?? platform.key}
                        size={16}
                        style={{marginRight: '0.5rem'}}
                        format="sm"
                      />
                      {platform.title}
                    </span>
                  </RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className={styles['item-indicator']}>
                    <CheckIcon />
                  </RadixSelect.ItemIndicator>
                </ComboboxItem>
              </RadixSelect.Item>
            ))}
          </ComboboxList>
        </RadixSelect.Content>
      </ComboboxProvider>
    </RadixSelect.Root>
  );
}
