import {describe, expect, it} from 'vitest';

import {sentryLoginUrl} from './docsOrigin';

describe('sentryLoginUrl', () => {
  it('redirects back to the page on docs.sentry.io', () => {
    const url = new URL(sentryLoginUrl('/platforms/javascript/guides/nextjs/tracing/'));

    expect(url.origin).toBe('https://sentry.io');
    expect(url.pathname).toBe('/auth/login/');
    expect(url.searchParams.get('next')).toBe(
      'https://docs.sentry.io/platforms/javascript/guides/nextjs/tracing/'
    );
  });

  it('falls back to the docs root when there is no pathname', () => {
    const url = new URL(sentryLoginUrl(null));

    expect(url.searchParams.get('next')).toBe('https://docs.sentry.io/');
  });
});
