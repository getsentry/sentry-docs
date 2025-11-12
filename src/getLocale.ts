import {getDefaultLocale} from 'gt-next/server';

import {serverContext} from './serverContext';

export default function getLocale(): string {
  try {
    const ctx = serverContext();
    if (ctx.locale) {
      return ctx.locale;
    }
  } catch {
    // ignore if serverContext isn't initialized in this phase
  }
  return getDefaultLocale();
}
