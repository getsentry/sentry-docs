import {isDeveloperDocs} from './isDeveloperDocs';

/** Production origin of the docs site being built. Use it for every absolute docs URL. */
export const DOCS_ORIGIN = isDeveloperDocs
  ? 'https://develop.sentry.dev'
  : 'https://docs.sentry.io';

/** Sentry login URL that sends the user back to `pathname` on this docs site. */
export function sentryLoginUrl(pathname: string | null): string {
  const next = new URL(pathname ?? '/', DOCS_ORIGIN).toString();
  return `https://sentry.io/auth/login/?next=${encodeURIComponent(next)}`;
}
