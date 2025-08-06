'use client';

import {useState} from 'react';
import {X} from 'react-feather';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';

interface ImageLightboxProps {
  alt: string;
  children: React.ReactNode;
  height: number;
  imgPath: string;
  src: string;
  width: number;
}

export function ImageLightbox({
  src,
  alt,
  width,
  height,
  imgPath,
  children,
}: ImageLightboxProps) {
  const [open, setOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // If Ctrl/Cmd+click, let the link handle it naturally (opens in new tab)
    if (e.ctrlKey || e.metaKey) {
      // Allow default link behavior
      return;
    }
    // Normal click - prevent link navigation and open lightbox
    e.preventDefault();
    setOpen(true);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* Custom trigger that handles modifier keys properly */}
      <a
        href={imgPath}
        target="_blank"
        rel="noreferrer"
        className="cursor-pointer border-none bg-transparent p-0 block w-full no-underline"
        onClick={handleClick}
      >
        {children}
      </a>

      <Dialog.Portal>
        <Dialog.Overlay className="image-lightbox-overlay fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />

        <Dialog.Content className="image-lightbox-content fixed left-[50%] top-[50%] z-50 max-h-[90vh] max-w-[90vw] translate-x-[-50%] translate-y-[-50%]">
          {/* Close button */}
          <Dialog.Close className="absolute right-4 top-4 z-10 rounded-sm bg-black/50 p-2 text-white opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          {/* Image container */}
          <div className="relative flex items-center justify-center">
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
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
