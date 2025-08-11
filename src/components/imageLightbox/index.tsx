'use client';

import {useState} from 'react';
import Image from 'next/image';

import {Lightbox} from 'sentry-docs/components/lightbox';
import {isAllowedRemoteImage, isExternalImage} from 'sentry-docs/config/images';

interface ImageLightboxProps
  extends Omit<
    React.HTMLProps<HTMLImageElement>,
    'ref' | 'src' | 'width' | 'height' | 'alt'
  > {
  alt: string;
  imgPath: string;
  src: string;
  height?: number;
  width?: number;
}

export const getImageUrl = (src: string, imgPath: string): string => {
  if (isExternalImage(src)) {
    // Normalize protocol-relative URLs to use https:
    return src.startsWith('//') ? `https:${src}` : src;
  }
  return imgPath;
};

export type ValidDimensions = {
  height: number;
  width: number;
};

export const getValidDimensions = (
  width?: number,
  height?: number
): ValidDimensions | null => {
  if (
    width != null &&
    height != null &&
    !isNaN(width) &&
    !isNaN(height) &&
    width > 0 &&
    height > 0
  ) {
    return {width, height};
  }
  return null;
};

export function ImageLightbox({
  src,
  alt,
  width,
  height,
  imgPath,
  style,
  className,
  ...props
}: ImageLightboxProps) {
  const [open, setOpen] = useState(false);

  const dimensions = getValidDimensions(width, height);
  const shouldUseNextImage =
    !!dimensions && (!isExternalImage(src) || isAllowedRemoteImage(src));

  const openInNewTab = () => {
    window.open(getImageUrl(src, imgPath), '_blank', 'noopener,noreferrer');
  };

  const handleClick = (e: React.MouseEvent) => {
    // Middle-click or Ctrl/Cmd+click opens in new tab
    if (e.button === 1 || e.ctrlKey || e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      openInNewTab();
    }
    // Regular click is handled by Dialog.Trigger
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd+Enter/Space opens in new tab
    // Regular Enter/Space is handled by Dialog.Trigger
    if ((e.key === 'Enter' || e.key === ' ') && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      openInNewTab();
    }
  };

  // Filter out props that are incompatible with Next.js Image component
  // Next.js Image has stricter typing for certain props like 'placeholder'
  const {placeholder: _placeholder, ...imageCompatibleProps} = props;

  const renderImage = (isInline: boolean = true) => {
    const renderedSrc = getImageUrl(src, imgPath);
    const imageClassName = isInline
      ? className
      : 'max-h-[90vh] max-w-[90vw] object-contain';
    const imageStyle = isInline
      ? {width: '100%', height: 'auto', ...style}
      : {width: 'auto', height: 'auto'};

    if (shouldUseNextImage && dimensions) {
      return (
        <Image
          src={renderedSrc}
          width={dimensions.width}
          height={dimensions.height}
          style={imageStyle}
          className={imageClassName}
          alt={alt}
          priority={!isInline}
          {...imageCompatibleProps}
        />
      );
    }
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={renderedSrc}
        alt={alt}
        loading={isInline ? 'lazy' : 'eager'}
        decoding="async"
        style={imageStyle}
        className={imageClassName}
        {...imageCompatibleProps}
      />
    );
  };

  return (
    <Lightbox.Root open={open} onOpenChange={setOpen} content={renderImage(false)}>
      <Lightbox.Trigger
        onClick={handleClick}
        onAuxClick={handleClick}
        onKeyDown={handleKeyDown}
        className="cursor-pointer border-none bg-transparent p-0 block w-full no-underline"
        aria-label={`View image: ${alt}`}
      >
        {renderImage()}
      </Lightbox.Trigger>
    </Lightbox.Root>
  );
}
