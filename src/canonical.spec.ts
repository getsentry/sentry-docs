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
    expect(resolvePageCanonical('cli', '/get-started/', origin)).toBe(
      'https://docs.sentry.io/get-started/'
    );
  });

  it('uses an absolute override as written', () => {
    expect(resolvePageCanonical('cli', 'https://cli.sentry.dev/', origin)).toBe(
      'https://cli.sentry.dev/'
    );
  });

  it('falls back to the page path when no override is set', () => {
    expect(resolvePageCanonical('cli', undefined, origin)).toBe(
      'https://docs.sentry.io/cli/'
    );
  });
});
