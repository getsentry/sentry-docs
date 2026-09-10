import {describe, expect, it} from 'vitest';

import {canonicalPath} from './canonical';

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
