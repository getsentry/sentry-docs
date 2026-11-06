import {unstable_getResponseFromNextConfig} from 'next/experimental/testing/server';
import {describe, expect, test} from 'vitest';

import {developerDocsRedirects, userDocsRedirects} from './redirects';

describe.each([
  ['developer docs', developerDocsRedirects],
  ['user docs', userDocsRedirects],
] as const)('%s source map', (_, redirects) => {
  test.each(['/api/source-map', '/api/source-map/'])(
    'leaves %s available to the API route',
    async pathname => {
      const response = await unstable_getResponseFromNextConfig({
        url: `https://example.com${pathname}`,
        nextConfig: {
          skipTrailingSlashRedirect: true,
          redirects: () => Promise.resolve(redirects.map(r => ({...r, permanent: true}))),
        },
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    }
  );
});

describe('legacy developer API documentation', () => {
  test.each([
    ['/api', '/backend/api'],
    ['/api/', '/backend/api'],
    ['/api/auth/', '/backend/api/auth'],
    ['/api/auth/tokens/?tab=1', '/backend/api/auth/tokens?tab=1'],
    ['/api/source-map-format/', '/backend/api/source-map-format'],
    ['/api/auth/source-map/', '/backend/api/auth/source-map'],
  ])('redirects %s to %s', async (pathname, destination) => {
    const response = await unstable_getResponseFromNextConfig({
      url: `https://example.com${pathname}`,
      nextConfig: {
        skipTrailingSlashRedirect: true,
        redirects: () =>
          Promise.resolve(developerDocsRedirects.map(r => ({...r, permanent: true}))),
      },
    });

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe(`https://example.com${destination}`);
  });
});
