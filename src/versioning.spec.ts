import {describe, expect, test} from 'vitest';

import {getUnversionedPath, getVersion} from './versioning';

describe('versioning', () => {
  test('should return unversioned paths', () => {
    expect(getUnversionedPath('/')).toBe('/');
    expect(getUnversionedPath('/some/path')).toBe('/some/path/');
    expect(getUnversionedPath('/some/path__v2')).toBe('/some/path/');
    expect(getUnversionedPath('/some/path__v2/')).toBe('/some/path/');
    expect(getUnversionedPath(['some', 'path__v2'])).toBe('some/path/');
    expect(getUnversionedPath(['some', 'path__v2'], false)).toBe('some/path');
  });

  test('should return version from slug', () => {
    expect(getVersion('/')).toBe('');
    expect(getVersion('/some/path__v7.x')).toBe('7.x');
    expect(getVersion('/some/path__v7.x/')).toBe('7.x');
  });
});
