import {describe, expect, it, vi} from 'vitest';

import {getImageUrl, getValidDimensions} from 'sentry-docs/components/imageLightbox';
import {isAllowedRemoteImage, isExternalImage} from 'sentry-docs/config/images';

// Mock image config functions
vi.mock('sentry-docs/config/images', () => ({
  isExternalImage: vi.fn((src: string) => src.startsWith('http') || src.startsWith('//')),
  isAllowedRemoteImage: vi.fn((src: string) => src.includes('allowed-domain.com')),
}));

const shouldUseNextImage = (width?: number, height?: number, src?: string) => {
  const hasValidDimensions = getValidDimensions(width, height) !== null;
  if (!hasValidDimensions || !src) return false;

  return !isExternalImage(src) || isAllowedRemoteImage(src);
};

// Test data
const issuesPageImages = [
  {src: './img/issue_page.png', resolved: '/docs/product/issues/img/issue_page.png'},
  {src: './img/error_level.png', resolved: '/docs/product/issues/img/error_level.png'},
  {src: './img/issue_sort.png', resolved: '/docs/product/issues/img/issue_sort.png'},
];

describe('ImageLightbox Helper Functions', () => {
  describe('getImageUrl', () => {
    it('should handle local image URL resolution', () => {
      // Test that local images use the resolved imgPath
      const localCases = [
        {src: '/local/image.jpg', imgPath: '/resolved/image.jpg'},
        {src: './relative/image.png', imgPath: '/absolute/resolved/image.png'},
      ];

      localCases.forEach(({src, imgPath}) => {
        expect(getImageUrl(src, imgPath)).toBe(imgPath);
      });
    });

    it('should return original src for external HTTP images', () => {
      expect(getImageUrl('https://example.com/image.jpg', '/fallback.jpg')).toBe(
        'https://example.com/image.jpg'
      );
    });

    it('should normalize protocol-relative URLs', () => {
      expect(getImageUrl('//example.com/image.jpg', '/fallback.jpg')).toBe(
        'https://example.com/image.jpg'
      );
    });
  });

  describe('getValidDimensions', () => {
    it('should return valid dimensions object for positive numbers', () => {
      const validCases = [
        {width: 800, height: 600},
        {width: 1920, height: 1080},
        {width: 1200, height: 800}, // Issues page dimensions
        {width: 32, height: 32}, // Small icon dimensions
      ];

      validCases.forEach(({width, height}) => {
        expect(getValidDimensions(width, height)).toEqual({width, height});
      });
    });

    it('should return null for invalid dimensions', () => {
      const invalidCases = [
        [0, 600],
        [800, -1],
        [NaN, 600],
        [800, NaN],
        [undefined, 600],
        [800, undefined],
        [null, 600],
        [800, null],
      ];

      invalidCases.forEach(([width, height]) => {
        expect(getValidDimensions(width as any, height as any)).toBeNull();
      });
    });
  });

  describe('shouldUseNextImage logic', () => {
    it('should use Next.js Image for local images with valid dimensions', () => {
      const localImageCases = [
        {width: 800, height: 600, src: '/local/image.jpg'},
        {width: 1200, height: 800, src: './img/issue_page.png'},
        {width: 32, height: 32, src: './img/error_level.png'},
      ];

      localImageCases.forEach(({width, height, src}) => {
        expect(shouldUseNextImage(width, height, src)).toBe(true);
      });
    });

    it('should use Next.js Image for allowed external images with valid dimensions', () => {
      expect(shouldUseNextImage(800, 600, 'https://allowed-domain.com/image.jpg')).toBe(
        true
      );
    });

    it('should not use Next.js Image for disallowed external images', () => {
      expect(shouldUseNextImage(800, 600, 'https://external-domain.com/image.jpg')).toBe(
        false
      );
    });

    it('should not use Next.js Image without valid dimensions', () => {
      const invalidCases = [
        {width: undefined, height: 600, src: '/local/image.jpg'},
        {width: 800, height: undefined, src: '/local/image.jpg'},
        {width: 0, height: 600, src: '/local/image.jpg'},
        {width: 1200, height: 800, src: undefined},
      ];

      invalidCases.forEach(({width, height, src}) => {
        expect(shouldUseNextImage(width, height, src)).toBe(false);
      });
    });
  });

  describe('Issues page scenarios', () => {
    it('should handle Issues page image URLs correctly', () => {
      issuesPageImages.forEach(({src, resolved}) => {
        expect(getImageUrl(src, resolved)).toBe(resolved);
      });
    });

    it('should handle relative path resolution context', () => {
      // When DocImage processes relative paths, imgPath should be the resolved path
      const relativeSrc = './img/issue_page.png#1200x800';
      const resolvedImgPath = '/docs/product/issues/img/issue_page.png';

      expect(getImageUrl(relativeSrc, resolvedImgPath)).toBe(resolvedImgPath);
    });
  });
});

describe('Event Handling Logic', () => {
  describe('click and keyboard event patterns', () => {
    const shouldOpenInNewTab = (button: number, ctrlKey: boolean, metaKey: boolean) => {
      return button === 1 || ctrlKey || metaKey;
    };

    const isValidTriggerKey = (key: string) => key === 'Enter' || key === ' ';

    it('should identify new tab interaction patterns', () => {
      // Test actual user interaction scenarios
      expect(shouldOpenInNewTab(0, false, false)).toBe(false); // Regular click should open lightbox
      expect(shouldOpenInNewTab(1, false, false)).toBe(true); // Middle click should open new tab
      expect(shouldOpenInNewTab(0, true, false)).toBe(true); // Ctrl+click should open new tab
      expect(shouldOpenInNewTab(0, false, true)).toBe(true); // Cmd+click should open new tab
    });

    it('should identify valid keyboard triggers for lightbox', () => {
      // Test accessibility keyboard patterns
      expect(isValidTriggerKey('Enter')).toBe(true); // Standard activation
      expect(isValidTriggerKey(' ')).toBe(true); // Space bar activation
      expect(isValidTriggerKey('Tab')).toBe(false); // Tab should not trigger
      expect(isValidTriggerKey('Escape')).toBe(false); // Escape should not trigger
    });
  });
});
