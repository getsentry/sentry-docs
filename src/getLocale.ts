import {serverContext} from './serverContext';

let cachedDefaultLocale: string | null = null;

export function getDefaultLocaleSafe(): string {
  if (cachedDefaultLocale) {
    return cachedDefaultLocale;
  }
  let locale = 'en';
  try {
    // Use require to avoid bundling into environments where server-only throws
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const {getDefaultLocale} = require('gt-next/server');
    locale = getDefaultLocale?.() ?? 'en';
  } catch {
    // fall back to en when gt-next/server isn't available
  }
  cachedDefaultLocale = locale;
  return locale;
}

export default function getLocale(): string {
  try {
    const ctx = serverContext();
    if (ctx.locale) {
      return ctx.locale;
    }
  } catch {
    // ignore if serverContext isn't initialized in this phase
  }
  return getDefaultLocaleSafe();
}
