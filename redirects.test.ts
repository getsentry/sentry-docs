import {unstable_getResponseFromNextConfig} from 'next/experimental/testing/server';
import {describe, expect, it} from 'vitest';

import {userDocsRedirects, withMarkdownRedirects} from './redirects';

async function redirectLocation(
  list: {destination: string; source: string}[],
  path: string
) {
  const response = await unstable_getResponseFromNextConfig({
    url: `https://docs.sentry.io${path}`,
    nextConfig: {
      trailingSlash: true,
      redirects: () =>
        Promise.resolve(withMarkdownRedirects(list).map(r => ({...r, permanent: true}))),
    },
  });
  return response.headers.get('location');
}

describe('withMarkdownRedirects', () => {
  it('folds the .md URL into the same rule', () => {
    const list = [{source: '/old/', destination: '/new/'}];
    expect(withMarkdownRedirects(list)).toHaveLength(list.length);
  });

  it.each([
    ['/new/', '/old/', '/new/'],
    ['/new/', '/old.md', '/new.md'],
    ['/new/#section', '/old/', '/new/#section'],
    ['/new/#section', '/old.md', '/new.md#section'],
    ['https://mcp.sentry.dev', '/old.md', 'https://mcp.sentry.dev/'],
    ['/platform-redirect/?next=/x/', '/old.md', '/platform-redirect/?next=%2Fx%2F'],
  ])('redirects to %s: %s -> %s', async (destination, path, expected) => {
    expect(await redirectLocation([{source: '/old/', destination}], path)).toBe(
      new URL(expected, 'https://docs.sentry.io').href
    );
  });

  it.each([
    [
      '/platforms/:platform/old/',
      '/platforms/:platform/new/',
      '/platforms/python/old',
      '/platforms/python/new',
    ],
    [
      '/platforms/:platform/sourcemaps/:section(generating|validating)/',
      '/platforms/:platform/sourcemaps/',
      '/platforms/python/sourcemaps/validating',
      '/platforms/python/sourcemaps',
    ],
  ])('folds named params from %s', async (source, destination, from, to) => {
    const list = [{source, destination}];
    expect(withMarkdownRedirects(list)).toHaveLength(1);
    expect(await redirectLocation(list, `${from}.md`)).toBe(
      `https://docs.sentry.io${to}.md`
    );
    expect(await redirectLocation(list, `${from}/`)).toBe(`https://docs.sentry.io${to}/`);
  });

  it('adds a separate .md rule when the destination ends in a param', async () => {
    const list = [
      {
        source: '/platforms/dotnet/guides/:guide/compatibility/',
        destination: '/platforms/dotnet/guides/:guide/',
      },
    ];
    expect(withMarkdownRedirects(list)).toHaveLength(2);
    expect(
      await redirectLocation(list, '/platforms/dotnet/guides/aspnet/compatibility/')
    ).toBe('https://docs.sentry.io/platforms/dotnet/guides/aspnet/');
    expect(
      await redirectLocation(list, '/platforms/dotnet/guides/aspnet/compatibility.md')
    ).toBe('https://docs.sentry.io/platforms/dotnet/guides/aspnet.md');
  });

  it('does not match other extensions', async () => {
    const list = [{source: '/old/', destination: '/new/'}];
    expect(await redirectLocation(list, '/old.mdx')).toBeNull();
    expect(await redirectLocation(list, '/oldx/')).toBeNull();
  });

  it.each([
    ['/old.md', '/new.md'],
    ['/old/page.md', '/new.md'],
    ['/old/nested/page.md', '/new.md'],
    ['/old/page/', '/new/'],
    ['/old/page.mdx', '/new/'],
  ])('preserves the format of wildcard requests: %s', async (from, to) => {
    expect(
      await redirectLocation([{source: '/old/:path*', destination: '/new/'}], from)
    ).toBe(`https://docs.sentry.io${to}`);
  });

  it.each([
    ['/new/#section', 'https://docs.sentry.io/new.md#section'],
    ['/', 'https://docs.sentry.io/index.md'],
    ['/new/:path*', 'https://docs.sentry.io/new/nested/page.md'],
    ['https://mcp.sentry.dev/', 'https://mcp.sentry.dev/'],
    ['/platform-redirect/', 'https://docs.sentry.io/platform-redirect/'],
    [
      '/platform-redirect/?next=/x/',
      'https://docs.sentry.io/platform-redirect/?next=%2Fx%2F',
    ],
  ])('handles wildcard destinations: %s', async (destination, expected) => {
    expect(
      await redirectLocation(
        [{source: '/old/:path*', destination}],
        '/old/nested/page.md'
      )
    ).toBe(expected);
  });

  it.each([
    ['/product/insights/mcp.md', '/product/mcp-servers.md'],
    ['/product/insights/http.md', '/product/dashboards/sentry-dashboards.md'],
    [
      '/platforms/python/guides/django/configuration/capture/context.md',
      '/platforms/python/guides/django/usage.md',
    ],
  ])('redirects %s using the real redirect list', async (from, to) => {
    expect(await redirectLocation(userDocsRedirects, from)).toBe(
      `https://docs.sentry.io${to}`
    );
  });

  it('leaves path-forwarding wildcards and root sources unchanged', () => {
    const list = [
      {source: '/', destination: '/new/'},
      {source: '/old/:path*', destination: '/new/:path*'},
    ];
    expect(withMarkdownRedirects(list)).toEqual(list);
  });
});
