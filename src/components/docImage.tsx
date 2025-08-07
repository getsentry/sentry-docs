import path from 'path';

import {serverContext} from 'sentry-docs/serverContext';

import {DocImageClient} from './docImageClient';

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

  // Handle external images early - pass through without processing
  if (src.startsWith('http')) {
    // Use provided props or defaults for external images
    const width =
      typeof propsWidth === 'number'
        ? propsWidth
        : typeof propsWidth === 'string'
          ? parseInt(propsWidth, 10) || 800
          : 800;
    const height =
      typeof propsHeight === 'number'
        ? propsHeight
        : typeof propsHeight === 'string'
          ? parseInt(propsHeight, 10) || 800
          : 800;

    return (
      <DocImageClient
        src={src}
        imgPath={src} // For external images, imgPath should be the same as src
        width={width}
        height={height}
        {...props}
      />
    );
  }

  // If the image src is not an absolute URL, we assume it's a relative path
  // and we prepend /mdx-images/ to it.
  if (src.startsWith('./')) {
    src = path.join('/mdx-images', src);
  }
  // account for the old way of doing things where the public folder structure mirrored the docs folder
  else if (!src?.startsWith('/') && !src?.includes('://')) {
    src = `/${pagePath.join('/')}/${src}`;
  }

  // parse the size from the URL hash (set by remark-image-size.js)
  let srcURL: URL;
  let imgPath: string;
  let dimensions: number[] = [];

  try {
    srcURL = new URL(src, 'https://example.com');
    imgPath = srcURL.pathname;
    dimensions = srcURL.hash // #wxh
      .slice(1)
      .split('x')
      .map(s => {
        const parsed = parseInt(s, 10);
        return isNaN(parsed) ? 0 : parsed;
      });
  } catch (_error) {
    // Failed to parse URL, fallback to using src directly
    imgPath = src;
    dimensions = [];
  }

  // Helper function to safely parse dimension values
  const parseDimension = (
    value: string | number | undefined,
    fallback: number = 800
  ): number => {
    if (typeof value === 'number' && value > 0) return value;
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return parsed > 0 ? parsed : fallback;
    }
    return fallback;
  };

  // Use parsed dimensions, fallback to props, then default to 800
  const width = dimensions[0] > 0 ? dimensions[0] : parseDimension(propsWidth);
  const height = dimensions[1] > 0 ? dimensions[1] : parseDimension(propsHeight);

  return (
    <DocImageClient
      src={src}
      imgPath={imgPath}
      width={width}
      height={height}
      {...props}
    />
  );
}
