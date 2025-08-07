'use client';

import {useState} from 'react';
import {X} from 'react-feather';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';

interface ImageLightboxProps {
  alt: string;
  height: number;
  imgPath: string;
  src: string;
  width: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ImageLightbox({
  src,
  alt,
  width,
  height,
  imgPath,
  style,
  className,
}: ImageLightboxProps) {
  const [open, setOpen] = useState(false);

  // Check if dimensions are valid (not NaN) for Next.js Image
  const isValidDimensions = !isNaN(width) && !isNaN(height) && width > 0 && height > 0;

  const handleClick = (e: React.MouseEvent) => {
    // If Ctrl/Cmd+click, open image in new tab
    if (e.ctrlKey || e.metaKey) {
      const url = src.startsWith('http') ? src : imgPath;
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
        const url = src.startsWith('http') ? src : imgPath;
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

  // Render the appropriate image component based on dimension validity
  const renderImage = () => {
    if (isValidDimensions) {
      return (
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
        <Dialog.Overlay className="image-lightbox-overlay fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />

        <Dialog.Content className="image-lightbox-content fixed left-[50%] top-[50%] z-50 max-h-[90vh] max-w-[90vw] translate-x-[-50%] translate-y-[-50%]">
          {/* Close button */}
          <Dialog.Close className="absolute right-4 top-4 z-10 rounded-sm bg-[var(--flame0)] border border-white/20 p-2 text-white opacity-90 transition-all duration-200 hover:opacity-100 hover:bg-[var(--flame1)] hover:border-white/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white active:scale-95 flex items-center justify-center">
            <X className="h-4 w-4 stroke-[2.5]" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          {/* Image container */}
          <div className="relative flex items-center justify-center">
            {isValidDimensions ? (
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                style={{
                  width: 'auto',
                  height: 'auto',
                }}
                priority
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
              />
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
