'use client';

import {ReactNode, useEffect, useReducer, useState} from 'react';
import {QuestionMarkCircledIcon} from '@radix-ui/react-icons';
import * as Tooltip from '@radix-ui/react-tooltip';
import {Button, Checkbox, Theme} from '@radix-ui/themes';

import styles from './styles.module.scss';

const optionDetails: Record<
  OptionId,
  {
    description: ReactNode;
    name: string;
    deps?: OptionId[];
  }
> = {
  'error-monitoring': {
    name: 'Error Monitoring',
    description: "Let's admit it, we all have errors.",
  },
  performance: {
    name: 'Performance Monitoring',
    description: (
      <span>
        Automatic performance issue detection across services and context on who is
        impacted, outliers, regressions, and the root cause of your slowdown.
      </span>
    ),
  },
  profiling: {
    name: 'Profiling',
    description: (
      <span>
        <span className={styles.TooltipTitle}>Requires Performance Monitoring</span>
        See the exact lines of code causing your performance bottlenecks, for faster
        troubleshooting and resource optimization.
      </span>
    ),
    deps: ['performance'],
  },
  'session-replay': {
    name: 'Session Replay',
    description: (
      <span>
        Video-like reproductions of user sessions with debugging context to help you
        confirm issue impact and troubleshoot faster.
      </span>
    ),
  },
};

const OPTION_IDS = [
  'error-monitoring',
  'performance',
  'profiling',
  'session-replay',
] as const;

type OptionId = (typeof OPTION_IDS)[number];

type OnboardingOptionType = {
  /**
   * Unique identifier for the option, will control the visibility
   * of `<OnboardingOption optionId="this_id"` /> somewhere on the page
   * or lines of code specified in in a `{onboardingOptions: {this_id: 'line-range'}}` in a code block meta
   */
  id: OptionId;
  /**
   * defaults to `true`
   */
  checked?: boolean;
  disabled?: boolean;
};

const validateOptionIds = (options: Pick<OnboardingOptionType, 'id'>[]) => {
  options.forEach(option => {
    if (!OPTION_IDS.includes(option.id)) {
      throw new Error(
        `Invalid option id: ${option.id}.\nValid options are: ${OPTION_IDS.map(opt => `"${opt}"`).join(', ')}`
      );
    }
  });
};

export function OnboardingOption({
  children,
  optionId,
  hideForThisOption,
}: {
  children: React.ReactNode;
  optionId: OptionId;
  hideForThisOption?: boolean;
}) {
  validateOptionIds([{id: optionId}]);
  return (
    <div
      data-onboarding-option={optionId}
      data-hide-for-this-option={hideForThisOption}
      className={hideForThisOption ? 'hidden' : ''}
    >
      {children}
    </div>
  );
}

export function OnboardingOptionButtons({
  options: initialOptions,
}: {
  // convenience to allow passing option ids as strings when no additional config is required
  options: (OnboardingOptionType | OptionId)[];
}) {
  const normalizedOptions = initialOptions.map(option => {
    if (typeof option === 'string') {
      return {id: option, disabled: option === 'error-monitoring'};
    }
    return option;
  });

  validateOptionIds(normalizedOptions);

  const [options, setSelectedOptions] = useState<OnboardingOptionType[]>(
    normalizedOptions.map(option => ({
      ...option,
      // default to checked if not excplicitly set
      checked: option.checked ?? true,
    }))
  );
  const [touchedOptions, touchOptions] = useReducer(() => true, false);

  function handleCheckedChange(clickedOption: OnboardingOptionType, checked: boolean) {
    touchOptions();
    const dependencies = optionDetails[clickedOption.id].deps ?? [];
    const depenedants =
      options.filter(opt => optionDetails[opt.id].deps?.includes(clickedOption.id)) ?? [];
    setSelectedOptions(prev => {
      // - select option and all dependencies
      // - disable dependencies
      if (checked) {
        return prev.map(opt => {
          if (opt.id === clickedOption.id) {
            return {
              ...opt,
              checked: true,
            };
          }
          if (dependencies.includes(opt.id)) {
            return {...opt, checked: true};
          }
          return opt;
        });
      }
      // unselect option and all dependants
      // Note: does not account for dependencies of multiple dependants
      return prev.map(opt => {
        if (opt.id === clickedOption.id) {
          return {
            ...opt,
            checked: false,
          };
        }
        // deselect dependants
        if (depenedants.find(dep => dep.id === opt.id)) {
          return {...opt, checked: false};
        }
        return opt;
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
        const hiddenForThisOption = el.dataset.hideForThisOption === 'true';
        if (hiddenForThisOption) {
          el.classList.toggle('hidden', option.checked);
        } else {
          el.classList.toggle('hidden', !option.checked);
        }
        // only animate things when user has interacted with the options
        if (touchedOptions) {
          if (el.classList.contains('code-line')) {
            el.classList.toggle('animate-line', option.checked);
          }
          // animate content, account for inverted logic for hiding
          else {
            el.classList.toggle(
              'animate-content',
              hiddenForThisOption ? !option.checked : option.checked
            );
          }
        }
      });
      if (option.checked && optionDetails[option.id].deps?.length) {
        const dependenciesSelecor = optionDetails[option.id].deps!.map(
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
  }, [options, touchedOptions]);

  return (
    <div className="flex flex-wrap gap-3 py-2 bg-white/90 sticky top-[80px] z-[1000] shadow-[var(--shadow-6)] transition">
      {options.map(option => (
        <Button
          variant="surface"
          size={{
            xs: '3',
            md: '2',
          }}
          disabled={option.disabled}
          asChild
          key={option.id}
          className="w-full md:w-auto"
        >
          <label role="button">
            <Checkbox
              defaultChecked={option.disabled}
              checked={option.checked}
              disabled={option.disabled}
              variant="soft"
              size="1"
              onCheckedChange={ev => {
                handleCheckedChange(option, ev as boolean);
              }}
            />

            {optionDetails[option.id].name}
            {optionDetails[option.id] && (
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <QuestionMarkCircledIcon fontSize={20} strokeWidth="2" />
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Theme accentColor="iris">
                      <Tooltip.Content className={styles.TooltipContent} sideOffset={5}>
                        {optionDetails[option.id].description}
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
