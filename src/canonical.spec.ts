import {describe, expect, it} from 'vitest';

import {canonicalPath, resolvePageCanonical} from './canonical';

describe('canonicalPath', () => {
  it.each([
    ['', '/'],
    ['/', '/'],
    ['platforms/java/configuration/options', '/platforms/java/configuration/options/'],
    ['/platforms/java/configuration/options/', '/platforms/java/configuration/options/'],
    ['platforms/java/migration/7.x-to-8.0', '/platforms/java/migration/7.x-to-8.0'],
    ['/platforms/python/migration/1.x-to-2.x/', '/platforms/python/migration/1.x-to-2.x'],
  ])('formats %j as %j', (pathname, expected) => {
    expect(canonicalPath(pathname)).toBe(expected);
  });
});

describe('resolvePageCanonical', () => {
  const origin = 'https://docs.sentry.io';

  it('resolves a site-relative override against the docs origin', () => {
    expect(resolvePageCanonical('/get-started/', origin)).toBe(
      'https://docs.sentry.io/get-started/'
    );
  });

  it('uses an absolute override as written', () => {
    expect(resolvePageCanonical('https://cli.sentry.dev/', origin)).toBe(
      'https://cli.sentry.dev/'
    );
  });

  it('resolves a page path against the docs origin', () => {
    expect(resolvePageCanonical('cli', origin)).toBe('https://docs.sentry.io/cli/');
  });
});
