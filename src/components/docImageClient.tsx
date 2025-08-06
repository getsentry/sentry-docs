'use client';

import Image from 'next/image';

import {ImageLightbox} from './imageLightbox';

interface DocImageClientProps
  extends Omit<
    React.HTMLProps<HTMLImageElement>,
    'ref' | 'placeholder' | 'src' | 'width' | 'height'
  > {
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
    const handleClick = (e: React.MouseEvent) => {
      // If Ctrl/Cmd+click, open image in new tab
      if (e.ctrlKey || e.metaKey) {
        window.open(imgPath, '_blank', 'noreferrer');
        return;
      }
    };

    return (
      <div onClick={handleClick} className="cursor-pointer">
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
      </div>
    );
  }

  return (
    <ImageLightbox
      src={src}
      alt={alt ?? ''}
      width={width}
      height={height}
      imgPath={imgPath}
    >
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
