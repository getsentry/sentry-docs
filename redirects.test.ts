import {describe, expect, it} from 'vitest';

import {withMarkdownRedirects} from './redirects';

describe('withMarkdownRedirects', () => {
  it('adds a .md twin right after each redirect', () => {
    expect(
      withMarkdownRedirects([
        {source: '/old/', destination: '/new/'},
        {source: '/old/:path*', destination: '/new/'},
      ])
    ).toEqual([
      {source: '/old/', destination: '/new/'},
      {source: '/old.md', destination: '/new.md'},
      {source: '/old/:path*', destination: '/new/'},
    ]);
  });

  it.each([
    ['/new/#section', '/new.md#section'],
    ['/', '/index.md'],
    ['/platforms/:platform/sourcemaps/', '/platforms/:platform/sourcemaps.md'],
    ['https://mcp.sentry.dev', 'https://mcp.sentry.dev'],
    ['/platform-redirect/?next=/x/', '/platform-redirect/?next=/x/'],
  ])('maps destination %s to %s', (destination, expected) => {
    expect(withMarkdownRedirects([{source: '/old/', destination}])[1]).toEqual({
      source: '/old.md',
      destination: expected,
    });
  });

  it('does not add a twin for the root redirect', () => {
    expect(withMarkdownRedirects([{source: '/', destination: '/new/'}])).toHaveLength(1);
  });
});
