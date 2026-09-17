import {describe, expect, test} from 'vitest';

import {isInternalUrl, resolveInternalUrl, resolveLinkUrl} from './url';

describe('resolveLinkUrl', () => {
  const pageUrl = new URL('http://localhost:3000/platforms/javascript/');

  test('resolves hrefs without a protocol as relative URLs', () => {
    expect(resolveLinkUrl('example.com', pageUrl)?.href).toBe(
      'http://localhost:3000/platforms/javascript/example.com'
    );
  });

  test('returns null for malformed URLs', () => {
    expect(resolveLinkUrl('http://[', pageUrl)).toBeNull();
  });
});

describe('internal URLs', () => {
  const baseUrl = new URL('http://localhost:3000/');

  test('recognizes only the configured documentation hostname', () => {
    expect(
      isInternalUrl(
        new URL('https://develop.sentry.dev/sdk/'),
        baseUrl,
        'develop.sentry.dev'
      )
    ).toBe(true);
    expect(
      isInternalUrl(
        new URL('https://docs.sentry.io/platforms/'),
        baseUrl,
        'develop.sentry.dev'
      )
    ).toBe(false);
  });

  test('maps configured documentation URLs to the local server', () => {
    expect(
      resolveInternalUrl(
        new URL('https://develop.sentry.dev/sdk/?ref=test#transport'),
        baseUrl,
        'develop.sentry.dev'
      ).href
    ).toBe('http://localhost:3000/sdk/?ref=test#transport');
  });
});
