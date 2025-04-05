import {describe, expect, test} from 'vitest';

import {addVersionToFilePath, getVersionedIndexPath, getVersionsFromDoc} from './mdx';
import {FrontMatter} from './types';

const mockFm: FrontMatter[] = [
  {
    title: 'js',
    slug: 'platforms/javascript',
  },
  {
    title: 'go',
    slug: 'platforms/go',
  },
];

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
    test('return versioned path for root level common file', () => {
      expect(
        getVersionedIndexPath('/', 'docs/platforms/javascript__v7/common', '.mdx')
      ).toBe('/docs/platforms/javascript/common/index__v7.mdx');
    });
  });

  describe('getVersionsFromDoc', () => {
    test('should return no versions from unversioned docs', () => {
      const fm: FrontMatter[] = [...mockFm];
      const versions = getVersionsFromDoc(fm, '/platforms/javascript');
      expect(versions).toHaveLength(0);
    });

    test('should return one version from versioned docs', () => {
      const fm: FrontMatter[] = [
        ...mockFm,
        {title: 'js', slug: 'platforms/javascript__v2'},
        {title: 'go', slug: 'platforms/go__v2'},
      ];
      const versions = getVersionsFromDoc(fm, 'platforms/javascript');
      expect(versions).toHaveLength(1);
      expect(versions).toContain('2');
    });

    test('should return several versions from versioned docs', () => {
      const fm: FrontMatter[] = [
        ...mockFm,
        {title: 'js', slug: 'platforms/javascript__v2'},
        {title: 'js', slug: 'platforms/javascript__v1.23'},
        {title: 'js', slug: 'platforms/javascript__v1.23.1'},
        {title: 'go', slug: 'platforms/go__v2'},
      ];
      const versions = getVersionsFromDoc(fm, 'platforms/javascript');
      expect(versions).toHaveLength(3);
      expect(versions).toContain('1.23');
      expect(versions).toContain('1.23.1');
      expect(versions).toContain('2');
    });

    test('should not contain duplicates', () => {
      const fm: FrontMatter[] = [
        ...mockFm,
        {title: 'js', slug: 'platforms/javascript__v2'},
        {title: 'js', slug: 'platforms/javascript/guides/nextjs'},
        {title: 'js', slug: 'platforms/javascript/guides/nextjs__v2'},
      ];
      const versions = getVersionsFromDoc(fm, 'platforms/javascript/guides/nextjs');
      expect(versions).toHaveLength(1);
      expect(versions).toContain('2');
    });

    test('should not contain versions for partly matching slugs', () => {
      const fm: FrontMatter[] = [
        ...mockFm,
        {title: 'js', slug: 'platforms/javascript__v2'},
      ];
      const versions = getVersionsFromDoc(
        fm,
        'platforms/javascript/configuration/environments'
      );
      expect(versions).toHaveLength(0);
    });
  });

  describe('addVersionToFilePath', () => {
    test('should add version to file path', () => {
      expect(addVersionToFilePath('platforms/javascript', '2')).toBe(
        'platforms/javascript__v2'
      );
    });

    test('should add version to file with extension', () => {
      expect(addVersionToFilePath('platforms/javascript/index.mdx', '2')).toBe(
        'platforms/javascript/index__v2.mdx'
      );
    });
  });
});
