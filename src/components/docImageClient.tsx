'use client';

import Image from 'next/image';
import {ImageLightbox} from './imageLightbox';

interface DocImageClientProps {
  src: string;
  imgPath: string;
  width: number;
  height: number;
  alt: string;
  style?: React.CSSProperties;
  className?: string;
}

export function DocImageClient({
  src,
  imgPath,
  width,
  height,
  alt,
  style,
  className,
}: DocImageClientProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
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

  return (
    <div onContextMenu={handleContextMenu} onClick={handleClick}>
      <ImageLightbox
        src={src}
        alt={alt}
        width={width}
        height={height}
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
          alt={alt}
        />
      </ImageLightbox>
    </div>
  );
}