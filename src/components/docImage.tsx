import imageSize from 'image-size';
import Image from 'next/image';

import {serverContext} from 'sentry-docs/serverContext';

export default function DocImage({
  src,
  ...props
}: Omit<React.HTMLProps<HTMLImageElement>, 'ref' | 'placeholder'>) {
  const {path} = serverContext();
  // If the image is not an absolute URL, we assume it's a relative path
  // and we prepend the current path to it
  if (!src?.startsWith('/') && !src?.includes('://')) {
    src = `/${path.join('/')}/${src}`;
  }

  // Next.js Image component only supports images from the public folder
  // or from a remote server with properly configured domain
  if (src.startsWith('http')) {
    return <img src={src} {...props} />;
  }

  const {width, height} = imageSize(`${process.cwd()}/public${src}`);

  return (
    <div style={{textAlign: 'center'}}>
      <a href={src} target="_blank" rel="noreferrer">
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
