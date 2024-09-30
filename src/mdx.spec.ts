import {describe, expect, test} from 'vitest';

import {getVersionedIndexPath} from './mdx';

describe('mdx', () => {
  describe('getVersionedIndexPath', () => {
    test('returns versioned path', () => {
      expect(getVersionedIndexPath('/', 'guide__v2', '.mdx')).toBe(
        '/guide/index__v2.mdx'
      );
      expect(getVersionedIndexPath('/', 'some/path/guide__v2', '.mdx')).toBe(
        '/some/path/guide/index__v2.mdx'
      );
      expect(
        getVersionedIndexPath(
          '/Users/charlygomez/Desktop/code/sentry-docs',
          'docs/platforms/javascript/guides/nextjs/usage__v7.119.0',
          '.mdx'
        )
      ).toBe(
        '/Users/charlygomez/Desktop/code/sentry-docs/docs/platforms/javascript/guides/nextjs/usage/index__v7.119.0.mdx'
      );
    });
    test('returns invalid path for non versioned files', () => {
      expect(getVersionedIndexPath('/', 'guide', '.mdx')).toBe('/does/not/exist.mdx');
      expect(getVersionedIndexPath('/', 'some/path/guide', '.mdx')).toBe(
        '/does/not/exist.mdx'
      );
    });
  });
});
