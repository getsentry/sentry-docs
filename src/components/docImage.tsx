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
    const width = typeof propsWidth === 'number'
      ? propsWidth
      : typeof propsWidth === 'string'
        ? parseInt(propsWidth, 10) || 800
        : 800;
    const height = typeof propsHeight === 'number'
      ? propsHeight
      : typeof propsHeight === 'string'
        ? parseInt(propsHeight, 10) || 600
        : 600;
        
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
  const srcURL = new URL(src, 'https://example.com');
  const imgPath = srcURL.pathname;
  const dimensions = srcURL.hash // #wxh
    .slice(1)
    .split('x')
    .map(s => parseInt(s, 10));

  // Use parsed dimensions, fallback to props, then default to 800
  const width = !isNaN(dimensions[0])
    ? dimensions[0]
    : typeof propsWidth === 'number'
      ? propsWidth
      : typeof propsWidth === 'string'
        ? parseInt(propsWidth, 10) || 800
        : 800;
  const height = !isNaN(dimensions[1])
    ? dimensions[1]
    : typeof propsHeight === 'number'
      ? propsHeight
      : typeof propsHeight === 'string'
        ? parseInt(propsHeight, 10) || 800
        : 800;

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
