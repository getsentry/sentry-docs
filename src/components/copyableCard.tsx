'use client';

import {Fragment, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {Clipboard} from 'react-feather';

import Chevron from 'sentry-docs/icons/Chevron';

interface CopyableCardProps {
  children: React.ReactNode;
  description: string;
  title: string;
}

export function CopyableCard({title, description, children}: CopyableCardProps) {
  const [copiedItem, setCopiedItem] = useState<'title' | 'description' | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  async function copyText(text: string, item: 'title' | 'description') {
    try {
      await navigator.clipboard.writeText(text.trim());
      setCopiedItem(item);
      setIsOpen(false);
      setTimeout(() => setCopiedItem(null), 1500);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to copy:', error);
    }
  }

  const getDropdownPosition = () => {
    if (!buttonRef.current) {
      return {top: 0, left: 0};
    }
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 8,
      left: rect.right - 160,
    };
  };

  const buttonClass =
    'inline-flex items-center text-nowrap h-full text-gray-700 dark:text-[var(--foreground)] bg-transparent border-none cursor-pointer transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-[var(--gray-a4)] active:bg-gray-100 dark:active:bg-[var(--gray-5)] focus:bg-gray-50 dark:focus:bg-[var(--gray-a4)] outline-none';
  const dropdownItemClass =
    'w-full p-2 px-3 text-left text-sm bg-transparent border-none rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-[var(--gray-a4)] font-sans text-gray-900 dark:text-[var(--foreground)] cursor-pointer';

  const getButtonLabel = () => {
    if (copiedItem === 'title') {
      return 'Reply title copied!';
    }
    if (copiedItem === 'description') {
      return 'Reply description copied!';
    }
    return 'Copy';
  };

  return (
    <div className="my-6 rounded-lg border border-gray-200 dark:border-[var(--gray-6)] overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-gray-50 dark:bg-[var(--gray-2)] border-b border-gray-200 dark:border-[var(--gray-6)]">
        <h3 className="m-0 text-base font-semibold text-gray-900 dark:text-[var(--foreground)]">
          {title}
        </h3>

        {isMounted && (
          <Fragment>
            <div className="relative inline-block" ref={buttonRef}>
              <div className="inline-flex items-center h-8 border border-gray-200 dark:border-[var(--gray-6)] rounded-full overflow-hidden bg-white dark:bg-[var(--gray-2)]">
                <button
                  onClick={() => copyText(description, 'description')}
                  className={`${buttonClass} gap-1.5 px-3 text-sm font-medium`}
                  style={{borderRadius: '9999px 0 0 9999px'}}
                >
                  <Clipboard size={14} />
                  <span>{getButtonLabel()}</span>
                </button>

                <div className="w-px h-full bg-gray-200 dark:bg-[var(--gray-6)]" />

                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={`${buttonClass} px-2`}
                  style={{borderRadius: '0 9999px 9999px 0'}}
                >
                  <Chevron
                    width={14}
                    height={14}
                    direction="down"
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                  />
                </button>
              </div>
            </div>

            {isOpen &&
              createPortal(
                <div
                  ref={dropdownRef}
                  className="fixed w-40 bg-white dark:bg-[var(--gray-2)] rounded-lg shadow-lg overflow-hidden z-[9999] border border-gray-300 dark:border-[var(--gray-6)]"
                  style={{...getDropdownPosition()}}
                >
                  <div className="p-1">
                    <button
                      onClick={() => copyText(title, 'title')}
                      className={dropdownItemClass}
                    >
                      Reply title
                    </button>
                    <button
                      onClick={() => copyText(description, 'description')}
                      className={dropdownItemClass}
                    >
                      Reply description
                    </button>
                  </div>
                </div>,
                document.body
              )}
          </Fragment>
        )}
      </div>
      <div className="p-4 bg-white dark:bg-[var(--gray-1)]">
        <div className="prose dark:prose-invert max-w-none">{children}</div>
      </div>
    </div>
  );
}
