import {beforeEach, describe, expect, it, vi} from 'vitest';

import {
  cleanUrl,
  DIMENSION_PATTERN,
  extractHash,
  parseDimensionsFromHash,
} from 'sentry-docs/components/docImage';
import {serverContext} from 'sentry-docs/serverContext';

// Mock the serverContext
vi.mock('sentry-docs/serverContext', () => ({
  serverContext: vi.fn(),
}));

// Mock the ImageLightbox component
vi.mock('./imageLightbox', () => ({
  ImageLightbox: vi.fn(({src, alt, width, height, imgPath}) => ({
    type: 'ImageLightbox',
    props: {src, alt, width, height, imgPath},
  })),
}));

const mockServerContext = serverContext as any;

describe('DocImage Helper Functions', () => {
  beforeEach(() => {
    mockServerContext.mockReturnValue({
      path: '/docs/test-page',
    });
  });

  describe('dimension validation bounds', () => {
    it('should validate dimensions within acceptable range', () => {
      // Test actual boundary conditions used in parseDimensionsFromHash
      expect(parseDimensionsFromHash('/image.jpg#1x1')).toEqual([1, 1]); // minimum valid
      expect(parseDimensionsFromHash('/image.jpg#10000x10000')).toEqual([10000, 10000]); // maximum valid
      expect(parseDimensionsFromHash('/image.jpg#0x600')).toEqual([]); // below minimum
      expect(parseDimensionsFromHash('/image.jpg#10001x5000')).toEqual([]); // above maximum
    });
  });

  describe('dimension pattern regex', () => {
    it('should match valid dimension patterns', () => {
      expect(DIMENSION_PATTERN.test('800x600')).toBe(true);
      expect(DIMENSION_PATTERN.test('1920x1080')).toBe(true);
      expect(DIMENSION_PATTERN.test('10000x10000')).toBe(true);
    });

    it('should not match invalid dimension patterns', () => {
      expect(DIMENSION_PATTERN.test('800x')).toBe(false);
      expect(DIMENSION_PATTERN.test('x600')).toBe(false);
      expect(DIMENSION_PATTERN.test('800')).toBe(false);
      expect(DIMENSION_PATTERN.test('800x600x400')).toBe(false);
      expect(DIMENSION_PATTERN.test('abc800x600')).toBe(false);
      expect(DIMENSION_PATTERN.test('section-heading')).toBe(false);
    });
  });

  describe('hash extraction', () => {
    it('should extract hash from URLs', () => {
      expect(extractHash('/image.jpg#800x600')).toBe('800x600');
      expect(extractHash('./img/issue_page.png#1200x800')).toBe('1200x800');
      expect(extractHash('https://example.com/image.jpg#section')).toBe('section');
      expect(extractHash('/image.jpg')).toBe('');
    });
  });

  describe('dimension parsing from hash', () => {
    it('should parse valid dimensions from URL hash', () => {
      expect(parseDimensionsFromHash('/image.jpg#800x600')).toEqual([800, 600]);
      expect(parseDimensionsFromHash('/image.jpg#1920x1080')).toEqual([1920, 1080]);
      expect(parseDimensionsFromHash('/image.jpg#10000x10000')).toEqual([10000, 10000]);
      expect(parseDimensionsFromHash('./img/issue_page.png#1200x800')).toEqual([
        1200, 800,
      ]);
    });

    it('should return empty array for invalid dimensions', () => {
      const invalidCases = [
        '/image.jpg#0x600',
        '/image.jpg#10001x5000',
        '/image.jpg#800x',
        '/image.jpg#section-heading',
        '/image.jpg',
        './img/error_level.png#malformed',
      ];

      invalidCases.forEach(url => {
        expect(parseDimensionsFromHash(url)).toEqual([]);
      });
    });
  });

  describe('URL cleaning', () => {
    it('should remove dimension hashes from URLs', () => {
      const testCases = [
        {input: '/image.jpg#800x600', expected: '/image.jpg'},
        {
          input: 'https://example.com/image.jpg#1920x1080',
          expected: 'https://example.com/image.jpg',
        },
        {input: './img/issue_page.png#1200x800', expected: './img/issue_page.png'},
        {input: './img/error_level.png#32x32', expected: './img/error_level.png'},
      ];

      testCases.forEach(({input, expected}) => {
        expect(cleanUrl(input)).toBe(expected);
      });
    });

    it('should preserve non-dimension hashes', () => {
      const testCases = [
        './img/issue_page.png#section-heading',
        '/image.jpg#important-section',
        '/image.jpg#anchor',
      ];

      testCases.forEach(url => {
        expect(cleanUrl(url)).toBe(url);
      });
    });

    it('should handle URLs without hashes', () => {
      const testCases = [
        '/image.jpg',
        'https://example.com/image.jpg',
        './img/issue_page.png',
      ];

      testCases.forEach(url => {
        expect(cleanUrl(url)).toBe(url);
      });
    });
  });

  describe('Issues page integration scenarios', () => {
    const issuesPageImages = [
      './img/issue_page.png#1200x800',
      './img/error_level.png#32x32',
      './img/issue_sort.png#600x400',
    ];

    it('should handle Issues page image paths correctly', () => {
      issuesPageImages.forEach(path => {
        const hash = extractHash(path);
        const cleanedUrl = cleanUrl(path);
        const dimensions = parseDimensionsFromHash(path);

        expect(hash).toMatch(DIMENSION_PATTERN);
        expect(cleanedUrl).not.toContain('#');
        expect(dimensions).toHaveLength(2);
        expect(dimensions[0]).toBeGreaterThan(0);
        expect(dimensions[1]).toBeGreaterThan(0);
      });
    });

    it('should handle malformed relative paths gracefully', () => {
      const malformedPaths = [
        './img/issue_page.png#800x',
        './img/error_level.png#invalid',
        './img/issue_sort.png#section-anchor',
      ];

      malformedPaths.forEach(path => {
        expect(cleanUrl(path)).toBe(path); // Should not clean non-dimension hashes
        expect(parseDimensionsFromHash(path)).toEqual([]); // Should return empty array
      });
    });
  });
});
