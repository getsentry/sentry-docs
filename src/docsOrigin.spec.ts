import {describe, expect, it} from 'vitest';

import {DOCS_ORIGIN, sentryLoginUrl} from './docsOrigin';

describe('sentryLoginUrl', () => {
  it('redirects back to the page on the production docs origin', () => {
    const url = new URL(sentryLoginUrl('/platforms/javascript/guides/nextjs/tracing/'));

    expect(url.origin).toBe('https://sentry.io');
    expect(url.pathname).toBe('/auth/login/');
    expect(url.searchParams.get('next')).toBe(
      `${DOCS_ORIGIN}/platforms/javascript/guides/nextjs/tracing/`
    );
  });

  it('uses docs.sentry.io for the user docs', () => {
    expect(DOCS_ORIGIN).toBe('https://docs.sentry.io');
  });
});
