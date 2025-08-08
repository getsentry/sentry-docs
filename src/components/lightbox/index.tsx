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
 * // Advanced usage with custom trigger and controlled state
 * const [open, setOpen] = useState(false);
 *
 * <Lightbox.Root
 *   open={open}
 *   onOpenChange={setOpen}
 *   content={<MyLargeContent />}
 *   trigger={
 *     <Lightbox.Trigger onClick={handleClick}>
 *       <MyThumbnail />
 *     </Lightbox.Trigger>
 *   }
 * />
 */

'use client';

import {useState} from 'react';
import {X} from 'react-feather';
import * as Dialog from '@radix-ui/react-dialog';

import styles from './lightbox.module.scss';

interface LightboxProps {
  children?: React.ReactNode;
  content: React.ReactNode;
  trigger?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  closeButton?: boolean;
}

interface LightboxTriggerProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
  'aria-label'?: string;
}

interface LightboxContentProps {
  children: React.ReactNode;
  className?: string;
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

// Trigger component for custom triggers
function LightboxTrigger({
  children,
  onClick,
  onKeyDown,
  className = '',
  'aria-label': ariaLabel,
}: LightboxTriggerProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`cursor-pointer border-none bg-transparent p-0 block w-full no-underline ${className}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

// Content wrapper (optional, for additional styling)
function LightboxContent({children, className = ''}: LightboxContentProps) {
  return <div className={className}>{children}</div>;
}

// Close button component
function LightboxClose({children, className = ''}: LightboxCloseProps) {
  return (
    <Dialog.Close className={className}>
      {children || (
        <>
          <X className="h-4 w-4 stroke-[2.5]" />
          <span className="sr-only">Close</span>
        </>
      )}
    </Dialog.Close>
  );
}

// Compound component exports
export const Lightbox = {
  Root: LightboxRoot,
  Trigger: LightboxTrigger,
  Content: LightboxContent,
  Close: LightboxClose,
};

// For backward compatibility, export the root as default
export default LightboxRoot;
