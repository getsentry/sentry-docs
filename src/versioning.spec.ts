import {describe, expect, test} from 'vitest';

import {getUnversionedPath} from './versioning';

describe('versioning', () => {
  test('should return unversioned paths', () => {
    expect(getUnversionedPath('/')).toBe('/');
    expect(getUnversionedPath('/some/path')).toBe('/some/path/');
    expect(getUnversionedPath('/some/path__v2')).toBe('/some/path/');
    expect(getUnversionedPath('/some/path__v2/')).toBe('/some/path/');
    expect(getUnversionedPath(['some', 'path__v2'])).toBe('some/path/');
    expect(getUnversionedPath(['some', 'path__v2'], false)).toBe('some/path');
  });
});
