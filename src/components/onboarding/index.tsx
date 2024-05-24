'use client';

import {useEffect, useRef, useState} from 'react';
import {QuestionMarkCircledIcon} from '@radix-ui/react-icons';
import * as Tooltip from '@radix-ui/react-tooltip';
import {Button, Checkbox, Theme} from '@radix-ui/themes';

import styles from './styles.module.scss';

export function OnboardingOption({
  children,
  optionId,
  dependsOn = [],
}: {
  children: React.ReactNode;
  optionId: string;
  dependsOn?: string[];
}) {
  return (
    <div data-onboarding-option={optionId} className="hidden" data-depends-on={dependsOn}>
      {children}
    </div>
  );
}

type OnboardingOptionType = {
  dependsOn: string[];
  /**
   * Unique identifier for the option, will control the visibility
   * of `<OnboardingOption optionId="this_id"` /> somewhere on the page
   * or lines of code specified in in a `{onboardingOptions: {this_id: 'line-range'}}` in a code block meta
   */
  id: string;
  name: string;
  disabled?: boolean;
  /**
   * Tooltip content, can contain simple HTML tags (like `<b>bold</b>`)
   */
  tooltip?: string;
};

const validateOptionDeps = (options: OnboardingOptionType[]) => {
  options.forEach(option => {
    option.dependsOn?.forEach(dep => {
      if (!options.find(opt => opt.id === dep)) {
        throw new Error(
          `Option dependency with \`${dep}\` not found: \`${JSON.stringify(option, null, 2)}\``
        );
      }
    });
  });
};

export function OnboardingOptionButtons({
  options: initialOptions,
}: {
  options: OnboardingOptionType[];
}) {
  validateOptionDeps(initialOptions);

  const [options, setSelectedOptions] = useState<
    (OnboardingOptionType & {selected: boolean})[]
  >(initialOptions.map(option => ({...option, selected: option.disabled || false})));

  function handleCheckedChange(option: OnboardingOptionType, selected: boolean) {
    setSelectedOptions(prev => {
      // - select option and all dependencies
      // - disable dependencies
      if (selected) {
        return prev.map(opt => {
          if (opt.id === option.id) {
            return {
              ...opt,
              selected: true,
            };
          }
          if (option.dependsOn?.includes(opt.id)) {
            return {...opt, disabled: true, selected: true};
          }
          return opt;
        });
      }
      // unselect option and reenable dependencies
      // Note: does not account for dependencies of multiple dependants
      return prev.map(opt => {
        if (opt.id === option.id) {
          return {
            ...opt,
            selected: false,
          };
        }
        // reenable dependencies
        return option.dependsOn?.includes(opt.id) ? {...opt, disabled: false} : opt;
      });
    });
  }
  useEffect(() => {
    options.forEach(option => {
      if (option.disabled) {
        return;
      }
      const targetElements = document.querySelectorAll<HTMLDivElement>(
        `[data-onboarding-option="${option.id}"]`
      );
      targetElements.forEach(el => {
        el.classList.toggle('hidden', !option.selected);
      });
      if (option.selected && option.dependsOn) {
        const dependenciesSelecor = option.dependsOn.map(
          dep => `[data-onboarding-option="${dep}"]`
        );
        const dependencies = document.querySelectorAll<HTMLDivElement>(
          dependenciesSelecor.join(', ')
        );

        dependencies.forEach(dep => {
          dep.classList.remove('hidden');
        });
      }
    });
  }, [options]);

  const buttonsRef = useRef<HTMLDivElement>(null);
  const containerTopPx = 100;
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      function ([buttonsContainer]) {
        setIsSticky(!buttonsContainer.isIntersecting);
      },
      {
        // the 1 exptra px is important to trigger the observer
        // https://stackoverflow.com/questions/16302483/event-to-detect-when-positionsticky-is-triggered
        rootMargin: `-${containerTopPx + 1}px 0px 0px 0px`,
        threshold: [1],
      }
    );

    observer.observe(buttonsRef.current!);
  }, []);

  // TW chokes on plain ${number}px
  const containerTopStr = `${containerTopPx}px`;
  return (
    <div
      ref={buttonsRef}
      className={`flex gap-4 py-2 bg-white/90 sticky top-[${containerTopStr}] z-[1000] rounded shadow-[var(--shadow-6)] transition ${
        isSticky ? 'px-2 backdrop-blur' : ''
      }`}
    >
      {options.map(option => (
        <Button
          variant="surface"
          size="2"
          disabled={option.disabled}
          asChild
          key={option.id}
        >
          <label role="button">
            <Checkbox
              defaultChecked={option.disabled}
              checked={options.find(opt => opt.id === option.id)?.selected}
              disabled={option.disabled}
              variant="soft"
              size="1"
              onCheckedChange={ev => {
                handleCheckedChange(option, ev as boolean);
              }}
            />

            {option.name}
            {option.tooltip && (
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <QuestionMarkCircledIcon fontSize={20} strokeWidth="2" />
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Theme accentColor="iris">
                      <Tooltip.Content className={styles.TooltipContent} sideOffset={5}>
                        {/* use `dangerouslySetInnerHTML` to render HTML tags */}
                        <span dangerouslySetInnerHTML={{__html: option.tooltip}} />
                        <Tooltip.Arrow className={styles.TooltipArrow} />
                      </Tooltip.Content>
                    </Theme>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            )}
          </label>
        </Button>
      ))}
    </div>
  );
}
