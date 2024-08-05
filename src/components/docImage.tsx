import path from 'path';

import Image from 'next/image';

import {serverContext} from 'sentry-docs/serverContext';

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

  // handle inline images (with |inline at the end of the alt text)
  if (props.alt?.endsWith('|inline')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imgPath}
        style={{
          display: 'inline',
          maxWidth: '100%',
          height: 'auto',
          border: 'none',
          boxShadow: 'none',
        }}
        {...props}
        alt={props.alt.replace('|inline', '')}
      />
    );
  }

  return (
    <div style={{textAlign: 'center'}}>
      <pre>
        src: {src}
        <br />
        props: {JSON.stringify(props, null, 2)}
      </pre>
      <a href={imgPath} target="_blank" rel="noreferrer">
        <Image
          {...props}
          src={src}
          width={width}
          height={height}
          style={{
            width: '100%',
            height: 'auto',
          }}
          alt={props.alt ?? ''}
        />
      </a>
    </div>
  );
}
