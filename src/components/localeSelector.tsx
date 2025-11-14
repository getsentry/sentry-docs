'use client';

import {useLocaleSelector} from 'gt-next/client';

function capitalizeFirst(label: string): string {
  if (!label) return label;
  const first = label[0];
  return first.toLocaleUpperCase() + label.slice(1);
}

export function LocaleSwitcher() {
  const {locale, locales, setLocale, getLocaleProperties} = useLocaleSelector();

  if (!locales || locales.length <= 1) return null;

  return (
    <label className="inline-flex items-center gap-2 text-[var(--gray-11)]">
      <span className="sr-only">Language</span>
      <select
        aria-label="Language selector"
        className="min-w-[7.5rem] px-2 py-[6px] rounded-md bg-[var(--gray-2)] border border-[var(--gray-a4)] text-[var(--foreground)] text-sm hover:border-[var(--gray-a6)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-9)] transition-colors"
        value={locale || ''}
        onChange={e => setLocale(e.target.value)}
      >
        {locales.map(loc => {
          const props = getLocaleProperties(loc);
          const raw = props.nativeNameWithRegionCode || loc;
          const label = capitalizeFirst(raw);
          return (
            <option
              key={loc}
              value={loc}
              className="bg-[var(--gray-1)] text-[var(--foreground)]"
            >
              {label}
            </option>
          );
        })}
      </select>
    </label>
  );
}
