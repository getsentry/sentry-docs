'use client';

import {useState} from 'react';
import {X} from 'react-feather';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';

import styles from './imageLightbox.module.scss';

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
const isExternalImage = (src: string): boolean => src.startsWith('http');

const getImageUrl = (src: string, imgPath: string): string =>
  isExternalImage(src) ? src : imgPath;

const hasValidDimensions = (width?: number, height?: number): width is number =>
  width != null &&
  height != null &&
  !isNaN(width) &&
  !isNaN(height) &&
  width > 0 &&
  height > 0;

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
  const shouldUseNextImage = !isExternalImage(src) && hasValidDimensions(width, height);

  const handleClick = (e: React.MouseEvent) => {
    // If Ctrl/Cmd+click, open image in new tab
    if (e.ctrlKey || e.metaKey) {
      const url = getImageUrl(src, imgPath);
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.opener = null; // Security: prevent opener access
      }
      return;
    }
    // Normal click - open lightbox
    setOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Enter and Space keys
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // If Ctrl/Cmd+key, open image in new tab
      if (e.ctrlKey || e.metaKey) {
        const url = getImageUrl(src, imgPath);
        const newWindow = window.open(url, '_blank');
        if (newWindow) {
          newWindow.opener = null; // Security: prevent opener access
        }
        return;
      }
      // Normal key press - open lightbox
      setOpen(true);
    }
  };

  // Filter out props that are incompatible with Next.js Image component
  // Next.js Image has stricter typing for certain props like 'placeholder'
  const {placeholder: _placeholder, ...imageCompatibleProps} = props;

  // Render the appropriate image component
  const renderImage = () => {
    if (shouldUseNextImage) {
      // Type assertion is safe here because hasValidDimensions guarantees these are valid numbers
      return (
        <Image
          src={src}
          width={width as number}
          height={height as number}
          style={{
            width: '100%',
            height: 'auto',
            ...style,
          }}
          className={className}
          alt={alt}
          {...imageCompatibleProps}
        />
      );
    }
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: 'auto',
          ...style,
        }}
        className={className}
        {...props}
      />
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* Custom trigger that handles modifier keys properly */}
      <div
        role="button"
        tabIndex={0}
        className="cursor-pointer border-none bg-transparent p-0 block w-full no-underline"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={`View image: ${alt}`}
      >
        {renderImage()}
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.lightboxOverlay} />

        <Dialog.Content className={styles.lightboxContent}>
          {/* Close button */}
          <Dialog.Close className="absolute right-4 top-4 z-10 rounded-sm bg-[var(--flame0)] border border-white/20 p-2 text-white opacity-90 transition-all duration-200 hover:opacity-100 hover:bg-[var(--flame1)] hover:border-white/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white active:scale-95 flex items-center justify-center">
            <X className="h-4 w-4 stroke-[2.5]" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          {/* Image container */}
          <div className="relative flex items-center justify-center">
            {shouldUseNextImage ? (
              <Image
                src={src}
                alt={alt}
                width={width as number}
                height={height as number}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                style={{
                  width: 'auto',
                  height: 'auto',
                }}
                priority
                {...imageCompatibleProps}
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={src}
                alt={alt}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                style={{
                  width: 'auto',
                  height: 'auto',
                }}
                {...props}
              />
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
