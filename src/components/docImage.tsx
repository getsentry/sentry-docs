import path from 'path';

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

// Helper function to parse dimensions from URL hash
const parseDimensionsFromHash = (url: string): number[] => {
  try {
    const urlObj = new URL(url, 'https://example.com');
    const hash = urlObj.hash.slice(1);

    // Only parse hash if it looks like dimensions (e.g., "800x600", "100x200")
    // Must be exactly two positive integers separated by 'x'
    const dimensionPattern = /^(\d+)x(\d+)$/;
    const match = hash.match(dimensionPattern);

    if (match) {
      const width = parseInt(match[1], 10);
      const height = parseInt(match[2], 10);
      return width > 0 && width <= 10000 && height > 0 && height <= 10000
        ? [width, height]
        : [];
    }

    return [];
  } catch (_error) {
    return [];
  }
};

// Helper function to clean URL by removing hash
const cleanUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // For external URLs, reconstruct without hash
    urlObj.hash = '';
    return urlObj.toString();
  } catch (_error) {
    // If URL parsing fails, just remove hash manually
    return url.split('#')[0];
  }
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

  const isExternalImage = src.startsWith('http') || src.startsWith('//');
  let finalSrc = src;
  let imgPath = src;

  // For internal images, process the path
  if (!isExternalImage) {
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
    // For external images, strip hash from both src and imgPath
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
