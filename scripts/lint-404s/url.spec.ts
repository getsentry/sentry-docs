import {describe, expect, test} from 'vitest';

import {isInternalUrl, localizeUrl, resolveLinkUrl} from './url';

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

describe('isInternalUrl', () => {
  const baseURL = new URL('http://localhost:3000/');

  test('treats the sitemap origin as internal', () => {
    expect(
      isInternalUrl(
        new URL('https://develop.sentry.dev/backend/'),
        baseURL,
        'https://develop.sentry.dev'
      )
    ).toBe(true);
  });

  test('treats the other docs site as external', () => {
    expect(
      isInternalUrl(
        new URL('https://docs.sentry.io/contributing/'),
        baseURL,
        'https://develop.sentry.dev'
      )
    ).toBe(false);
  });
});

describe('localizeUrl', () => {
  test('maps canonical links to the local server', () => {
    expect(
      localizeUrl(
        new URL('https://develop.sentry.dev/backend/?tab=1#redis'),
        new URL('http://localhost:3000/'),
        'https://develop.sentry.dev'
      ).href
    ).toBe('http://localhost:3000/backend/?tab=1#redis');
  });
});
