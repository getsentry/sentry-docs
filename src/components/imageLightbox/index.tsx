'use client';

import {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';

import {Lightbox} from 'sentry-docs/components/lightbox';
import {isAllowedRemoteImage} from 'sentry-docs/config/images';

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

// Helper functions
const isExternalImage = (src: string): boolean =>
  src.startsWith('http') || src.startsWith('//');

const getImageUrl = (src: string, imgPath: string): string =>
  isExternalImage(src) ? src : imgPath;

// Using shared allowlist logic from src/config/images

type ValidDimensions = {
  height: number;
  width: number;
};

const getValidDimensions = (width?: number, height?: number): ValidDimensions | null => {
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

  // Check if we should use Next.js Image or regular img
  // Use Next.js Image for internal images with valid dimensions
  // Use regular img for external images or when dimensions are invalid/missing
  const dimensions = getValidDimensions(width, height);
  const shouldUseNextImage =
    !!dimensions && (!isExternalImage(src) || isAllowedRemoteImage(src));

  const handleModifierClick = (e: React.MouseEvent) => {
    // If Ctrl/Cmd+click, open image in new tab instead of lightbox
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      const url = getImageUrl(src, imgPath);
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.opener = null; // Security: prevent opener access
      }
    }
    // Normal click will be handled by Dialog.Trigger
  };

  const handleModifierKeyDown = (e: React.KeyboardEvent) => {
    // Handle Ctrl/Cmd+Enter or Ctrl/Cmd+Space to open in new tab
    if ((e.key === 'Enter' || e.key === ' ') && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      const url = getImageUrl(src, imgPath);
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.opener = null; // Security: prevent opener access
      }
    }
    // Normal key presses will be handled by Dialog.Trigger
  };

  // Filter out props that are incompatible with Next.js Image component
  // Next.js Image has stricter typing for certain props like 'placeholder'
  const {placeholder: _placeholder, ...imageCompatibleProps} = props;

  // Render the appropriate image component
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
        loading={isInline ? 'lazy' : 'lazy'}
        decoding="async"
        style={imageStyle}
        className={imageClassName}
        {...props}
      />
    );
  };

  return (
    <Lightbox.Root open={open} onOpenChange={setOpen} content={renderImage(false)}>
      <Dialog.Trigger asChild>
        <div
          onClick={handleModifierClick}
          onKeyDown={handleModifierKeyDown}
          className="cursor-pointer border-none bg-transparent p-0 block w-full no-underline"
          aria-label={`View image: ${alt}`}
        >
          {renderImage()}
        </div>
      </Dialog.Trigger>
    </Lightbox.Root>
  );
}
