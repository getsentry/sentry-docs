import {match} from 'next/dist/compiled/path-to-regexp';
import {prepareDestination} from 'next/dist/shared/lib/router/utils/prepare-destination';
import {describe, expect, it} from 'vitest';

import {withMarkdownRedirects} from './redirects';

/** Resolves a request path against one redirect the way Next.js does. */
function resolve(redirect: {destination: string; source: string}, path: string) {
  const params = match(redirect.source, {decode: decodeURIComponent})(path);
  if (!params) {
    return null;
  }
  const {parsedDestination: dest} = prepareDestination({
    appendParamsToQuery: false,
    destination: redirect.destination,
    params: params.params as Record<string, string>,
    query: {},
  });
  const origin = dest.protocol ? `${dest.protocol}//${dest.hostname}` : '';
  const search = new URLSearchParams(dest.query as Record<string, string>).toString();
  return `${origin}${dest.pathname}${search ? `?${search}` : ''}${dest.hash ?? ''}`;
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
  ])('redirects to %s: %s -> %s', (destination, path, expected) => {
    const [redirect] = withMarkdownRedirects([{source: '/old/', destination}]);
    expect(resolve(redirect, path)).toBe(expected);
  });

  it('carries named params through to the destination', () => {
    const [redirect] = withMarkdownRedirects([
      {
        source: '/platforms/:platform/old/',
        destination: '/platforms/:platform/new/',
      },
    ]);
    expect(resolve(redirect, '/platforms/python/old.md')).toBe(
      '/platforms/python/new.md'
    );
    expect(resolve(redirect, '/platforms/python/old/')).toBe('/platforms/python/new/');
  });

  it('adds a separate .md rule when the destination ends in a param', () => {
    const list = [
      {
        source: '/platforms/dotnet/guides/:guide/compatibility/',
        destination: '/platforms/dotnet/guides/:guide/',
      },
    ];
    const result = withMarkdownRedirects(list);
    expect(result).toHaveLength(2);
    expect(resolve(result[0], '/platforms/dotnet/guides/aspnet/compatibility/')).toBe(
      '/platforms/dotnet/guides/aspnet/'
    );
    expect(resolve(result[1], '/platforms/dotnet/guides/aspnet/compatibility.md')).toBe(
      '/platforms/dotnet/guides/aspnet.md'
    );
  });

  it('does not match other extensions', () => {
    const [redirect] = withMarkdownRedirects([{source: '/old/', destination: '/new/'}]);
    expect(resolve(redirect, '/old.mdx')).toBeNull();
    expect(resolve(redirect, '/oldx/')).toBeNull();
  });

  it('leaves wildcard and root sources unchanged', () => {
    const list = [
      {source: '/', destination: '/new/'},
      {source: '/old/:path*', destination: '/new/:path*'},
    ];
    expect(withMarkdownRedirects(list)).toEqual(list);
  });
});
