/**
 * Reusable Lightbox component built on top of Radix UI Dialog
 *
 * @example
 * // Simple usage with children as trigger
 * <Lightbox.Root content={<img src="large.jpg" />}>
 *   <img src="thumbnail.jpg" alt="Click to expand" />
 * </Lightbox.Root>
 *
 * @example
 * // Advanced usage with Lightbox.Trigger and controlled state
 * const [open, setOpen] = useState(false);
 *
 * <Lightbox.Root open={open} onOpenChange={setOpen} content={<MyLargeContent />}>
 *   <Lightbox.Trigger asChild>
 *     <button onClick={handleClick}>
 *       <MyThumbnail />
 *     </button>
 *   </Lightbox.Trigger>
 * </Lightbox.Root>
 */

'use client';

import {Fragment, useState} from 'react';
import {X} from 'react-feather';
import * as Dialog from '@radix-ui/react-dialog';

import styles from './lightbox.module.scss';

interface LightboxProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  closeButton?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  trigger?: React.ReactNode;
}

interface LightboxTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface LightboxCloseProps {
  children?: React.ReactNode;
  className?: string;
}

// Root component
function LightboxRoot({
  children,
  content,
  trigger,
  onOpenChange,
  open: controlledOpen,
  closeButton = true,
}: LightboxProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {trigger || (children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>)}

      <Dialog.Portal>
        <Dialog.Overlay className={styles.lightboxOverlay} />
        <Dialog.Content className={styles.lightboxContent}>
          {closeButton && (
            <Dialog.Close className="absolute right-4 top-4 z-10 rounded-sm bg-[var(--flame0)] border border-white/20 p-2 text-white opacity-90 transition-all duration-200 hover:opacity-100 hover:bg-[var(--flame1)] hover:border-white/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white active:scale-95 flex items-center justify-center">
              <X className="h-4 w-4 stroke-[2.5]" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          )}
          <div className="relative flex items-center justify-center">{content}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Trigger component
function LightboxTrigger({children, asChild = false}: LightboxTriggerProps) {
  return <Dialog.Trigger asChild={asChild}>{children}</Dialog.Trigger>;
}

// Close button component
function LightboxClose({children, className = ''}: LightboxCloseProps) {
  return (
    <Dialog.Close className={className}>
      {children || (
        <Fragment>
          <X className="h-4 w-4 stroke-[2.5]" />
          <span className="sr-only">Close</span>
        </Fragment>
      )}
    </Dialog.Close>
  );
}

export const Lightbox = {
  Root: LightboxRoot,
  Trigger: LightboxTrigger,
  Close: LightboxClose,
};

export default LightboxRoot;
