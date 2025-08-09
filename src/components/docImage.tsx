import path from 'path';

import {isExternalImage} from 'sentry-docs/config/images';
import {serverContext} from 'sentry-docs/serverContext';

import {ImageLightbox} from './imageLightbox';

// Helper function to safely parse dimension values
const parseDimension = (value: string | number | undefined): number | undefined => {
  if (typeof value === 'number' && value > 0 && value <= 10000) return value;
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return parsed > 0 && parsed <= 10000 ? parsed : undefined;
  }
  return undefined;
};

// Dimension pattern regex - used to identify dimension hashes like "800x600"
const DIMENSION_PATTERN = /^(\d+)x(\d+)$/;

// Helper function to extract hash from URL string (works with both relative and absolute URLs)
const extractHash = (url: string): string => {
  const hashIndex = url.indexOf('#');
  return hashIndex !== -1 ? url.slice(hashIndex + 1) : '';
};

// Helper function to check if a hash contains dimension information
const isDimensionHash = (hash: string): boolean => {
  return DIMENSION_PATTERN.test(hash);
};

// Helper function to parse dimensions from URL hash
const parseDimensionsFromHash = (url: string): number[] => {
  const hash = extractHash(url);
  const match = hash.match(DIMENSION_PATTERN);

  if (match) {
    const width = parseInt(match[1], 10);
    const height = parseInt(match[2], 10);
    return width > 0 && width <= 10000 && height > 0 && height <= 10000
      ? [width, height]
      : [];
  }

  return [];
};

// Helper function to remove dimension hash from URL while preserving fragment identifiers
const cleanUrl = (url: string): string => {
  const hash = extractHash(url);

  // If no hash or hash is not a dimension pattern, return original URL
  if (!hash || !isDimensionHash(hash)) {
    return url;
  }

  // Remove dimension hash
  const hashIndex = url.indexOf('#');
  return url.slice(0, hashIndex);
};

export default function DocImage({
  src,
  width: propsWidth,
  height: propsHeight,
  ...props
}: Omit<React.HTMLProps<HTMLImageElement>, 'ref' | 'placeholder'>) {
  const {path: pagePath} = serverContext();

  if (!src) {
    return null;
  }

  const isExternal = isExternalImage(src);
  let finalSrc = src;
  let imgPath = src;

  // For internal images, process the path
  if (!isExternal) {
    if (src.startsWith('./')) {
      finalSrc = path.join('/mdx-images', src);
    } else if (!src?.startsWith('/') && !src?.includes('://')) {
      finalSrc = `/${pagePath.join('/')}/${src}`;
    }

    // For internal images, imgPath should be the pathname only
    try {
      const srcURL = new URL(finalSrc, 'https://example.com');
      imgPath = srcURL.pathname;
    } catch (_error) {
      imgPath = finalSrc;
    }
  } else {
    // For external images, clean URL by removing only dimension hashes, preserving fragment identifiers
    finalSrc = cleanUrl(src);
    imgPath = finalSrc;
  }

  // Parse dimensions from URL hash (works for both internal and external)
  const hashDimensions = parseDimensionsFromHash(src);

  // Use hash dimensions first, fallback to props
  const width = hashDimensions[0] > 0 ? hashDimensions[0] : parseDimension(propsWidth);
  const height = hashDimensions[1] > 0 ? hashDimensions[1] : parseDimension(propsHeight);

  return (
    <ImageLightbox
      src={finalSrc}
      imgPath={imgPath}
      width={width}
      height={height}
      alt={props.alt ?? ''}
      {...props}
    />
  );
}
