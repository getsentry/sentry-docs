import {DOCS_ORIGIN} from './docsSite.mjs';

/** Sentry login URL that sends the user back to `pathname` on this docs site. */
export function sentryLoginUrl(pathname: string | null): string {
  const next = `${DOCS_ORIGIN}${pathname ?? '/'}`;
  return `https://sentry.io/auth/login/?next=${encodeURIComponent(next)}`;
}
