'use client';

import {useEffect, useState} from 'react';
import {Button, Checkbox} from '@radix-ui/themes';

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

export function OnboardingOptionsButtons({
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

  return (
    <div className="flex gap-4 py-5">
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
          </label>
        </Button>
      ))}
    </div>
  );
}
