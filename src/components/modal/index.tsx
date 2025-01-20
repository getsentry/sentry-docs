'use client';
import {useEffect, useRef} from 'react';

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

export function Modal({isOpen, onClose, children, title}: Props) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      modalRef.current?.close();
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === modalRef.current) {
      handleClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <dialog
      ref={modalRef}
      className="backdrop:bg-[var(--gray-12)]/50 backdrop:backdrop-blur-sm p-0 bg-transparent w-full max-w-lg m-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%] duration-200 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[var(--gray-1)] rounded-lg shadow-lg border border-[var(--gray-6)] motion-safe:animate-modal-enter px-4">
        <div className="flex items-center justify-between py-5 border-b border-[var(--gray-6)] px-4">
          <h2 className="text-lg font-medium p!-0 !m-0">{title}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[var(--gray-3)] rounded-full transition-colors"
            aria-label="Close modal"
          >
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path
                d="M6 4.586l4.293-4.293 1.414 1.414L7.414 6l4.293 4.293-1.414 1.414L6 7.414l-4.293 4.293-1.414-1.414L4.586 6 .293 1.707 1.707.293 6 4.586z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>

      <style>{`
        @keyframes modal-enter {
          from {
            opacity: 0;
            transform: translate3d(0, -1rem, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        .animate-modal-enter {
          animation: modal-enter 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        ::backdrop {
          -webkit-backdrop-filter: blur(4px);
          backdrop-filter: blur(4px);
          background: rgba(var(--gray-12-rgb), 0.5);
          transition: all 0.2s ease-in-out;
        }

        dialog[open]::backdrop {
          opacity: 1;
        }

        dialog:not([open])::backdrop {
          opacity: 0;
        }

        dialog::backdrop {
          opacity: 0;
        }
      `}</style>
    </dialog>
  );
}
