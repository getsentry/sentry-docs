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
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default context menu
    // Allow right-click to open in new tab
    const link = document.createElement('a');
    link.href = imgPath;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.click();
  };

  const handleClick = (e: React.MouseEvent) => {
    // If Ctrl/Cmd+click, open in new tab instead of lightbox
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      window.open(imgPath, '_blank', 'noreferrer');
    }
  };

  // Check if dimensions are valid (not NaN) for Next.js Image
  const isValidDimensions = !isNaN(width) && !isNaN(height) && width > 0 && height > 0;
  
  // For external images or invalid dimensions, fall back to regular img tag
  if (src.startsWith('http') || !isValidDimensions) {
    return (
      <div onContextMenu={handleContextMenu} onClick={handleClick}>
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
    <div onContextMenu={handleContextMenu} onClick={handleClick}>
      <ImageLightbox src={src} alt={alt ?? ''} width={width} height={height}>
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
    </div>
  );
}
