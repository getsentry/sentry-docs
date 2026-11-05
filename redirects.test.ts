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
    const list = [
      {source: '/old/', destination: '/new/'},
      {source: '/old/:path*', destination: '/new/'},
    ];
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

  it('prioritizes the specific Markdown redirect over the catch-all', async () => {
    expect(await redirectLocation(userDocsRedirects, '/product/insights/mcp.md')).toBe(
      'https://docs.sentry.io/product/mcp-servers.md'
    );
  });

  it('leaves wildcard and root sources unchanged', () => {
    const list = [
      {source: '/', destination: '/new/'},
      {source: '/old/:path*', destination: '/new/:path*'},
    ];
    expect(withMarkdownRedirects(list)).toEqual(list);
  });
});
