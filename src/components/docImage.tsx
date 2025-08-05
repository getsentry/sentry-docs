import path from 'path';

import {serverContext} from 'sentry-docs/serverContext';
import {DocImageClient} from './docImageClient';

export default function DocImage({
  src,
  ...props
}: Omit<React.HTMLProps<HTMLImageElement>, 'ref' | 'placeholder'>) {
  const {path: pagePath} = serverContext();

  if (!src) {
    return null;
  }

  // Next.js Image component only supports images from the public folder
  // or from a remote server with properly configured domain
  if (src.startsWith('http')) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} {...props} />;
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
  const [width, height] = srcURL.hash // #wxh
    .slice(1)
    .split('x')
    .map(s => parseInt(s, 10));

  return (
    <DocImageClient
      src={src}
      imgPath={imgPath}
      width={width}
      height={height}
      alt={props.alt ?? ''}
      style={props.style}
      className={props.className}
    />
  );
}
