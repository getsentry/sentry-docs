'use client';

import Image from 'next/image';

import {ImageLightbox} from './imageLightbox';

interface DocImageClientProps extends Omit<React.HTMLProps<HTMLImageElement>, 'ref' | 'placeholder' | 'src' | 'width' | 'height'> {
  height: number;
  imgPath: string;
  src: string;
  width: number;
}

export function DocImageClient({
  src,
  imgPath,
  width,
  height,
  alt,
  style,
  className,
  ...props
}: DocImageClientProps) {
  // Check if dimensions are valid (not NaN) for Next.js Image
  const isValidDimensions = !isNaN(width) && !isNaN(height) && width > 0 && height > 0;
  
  // For external images or invalid dimensions, fall back to regular img tag
  if (src.startsWith('http') || !isValidDimensions) {
    return (
      <a href={imgPath} target="_blank" rel="noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ''}
          style={{
            width: '100%',
            height: 'auto',
            ...style,
          }}
          className={className}
          {...props}
        />
      </a>
    );
  }

  return (
    <ImageLightbox src={src} alt={alt ?? ''} width={width} height={height} imgPath={imgPath}>
      <Image
        src={src}
        width={width}
        height={height}
        style={{
          width: '100%',
          height: 'auto',
          ...style,
        }}
        className={className}
        alt={alt ?? ''}
        {...props}
      />
    </ImageLightbox>
  );
}
