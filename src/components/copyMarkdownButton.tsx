'use client';

import {Fragment, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {Clipboard} from 'react-feather';
import Link from 'next/link';

import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';
import Chevron from 'sentry-docs/icons/Chevron';
import Markdown from 'sentry-docs/icons/Markdown';

interface CopyMarkdownButtonProps {
  pathname: string;
}

export function CopyMarkdownButton({pathname}: CopyMarkdownButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {emit} = usePlausibleEvent();

  const copyMarkdownToClipboard = async () => {
    setIsLoading(true);
    setCopied(false);
    setError(false);
    setIsOpen(false);

    emit('Copy Page', {props: {page: pathname, source: 'copy_button'}});

    try {
      // This doesn't work on local development since we need the generated markdown
      // files, and we need to be aware of the origin since we have two different origins.
      const response = await fetch(`${window.location.origin}/${pathname}.md`);
      if (!response.ok) {
        throw new Error(`Failed to fetch markdown content: ${response.status}`);
      }

      await navigator.clipboard.writeText(await response.text());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy markdown to clipboard:', err);
      setError(true);
      setTimeout(() => setError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMarkdownClick = () => {
    emit('View Markdown', {props: {page: pathname, source: 'view_link'}});
    setIsOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      emit('Copy Page Dropdown', {props: {page: pathname, action: 'open'}});
    }
  };

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

  const getDropdownPosition = () => {
    if (!buttonRef.current) return {top: 0, left: 0};
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 8,
      left: rect.right - 320,
    };
  };

  const buttonClass = "inline-flex items-center h-full text-gray-700 bg-transparent border-none cursor-pointer transition-colors duration-150 hover:bg-gray-50 active:bg-gray-100 focus:bg-gray-50 outline-none";
  const dropdownItemClass = "flex items-center gap-3 w-full p-2 px-3 text-left bg-transparent rounded-md transition-colors hover:bg-gray-100 font-sans text-gray-900";
  const iconContainerClass = "flex items-center justify-center w-7 h-7 bg-gray-100 rounded shrink-0";

  return (
    <Fragment>
      <div className="relative inline-block" ref={buttonRef}>
        <div className="inline-flex items-center h-9 border border-gray-200 rounded-full overflow-hidden bg-white">
          <button
            onClick={copyMarkdownToClipboard}
            className={`${buttonClass} gap-2 px-3.5 text-sm font-medium disabled:opacity-50 ${error ? 'text-red-600' : ''}`}
            style={{borderRadius: '9999px 0 0 9999px'}}
            disabled={isLoading}
          >
            <Clipboard size={16} />
            <span>{error ? 'Failed to copy' : copied ? 'Copied!' : 'Copy page'}</span>
          </button>

          <div className="w-px h-full bg-gray-200" />

          <button
            onClick={handleDropdownToggle}
            className={`${buttonClass} px-3`}
            style={{borderRadius: '0 9999px 9999px 0'}}
          >
            <Chevron
              width={16}
              height={16}
              direction="down"
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>
        </div>
      </div>

      {isMounted && isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="fixed w-80 bg-white rounded-xl shadow-lg overflow-hidden z-[9999]"
          style={{...getDropdownPosition(), border: '1px solid #d1d5db'}}
        >
          <div className="p-1">
            <button
              onClick={copyMarkdownToClipboard}
              className={`${dropdownItemClass} border-none cursor-pointer disabled:opacity-50`}
              disabled={isLoading}
            >
              <div className={iconContainerClass}>
                <Clipboard size={14} />
              </div>
              <div className="flex-1">
                <div className={`font-medium text-sm leading-5 ${error ? 'text-red-600' : 'text-gray-900'}`}>
                  {error ? 'Failed to copy' : 'Copy page'}
                </div>
                <div className="text-xs text-gray-500 leading-4">
                  {error ? 'Network error - please try again' : 'Copy page as Markdown for LLMs'}
                </div>
              </div>
            </button>

            <Link
              href={`/${pathname}.md`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${dropdownItemClass} no-underline`}
              onClick={handleViewMarkdownClick}
            >
              <div className={iconContainerClass}>
                <Markdown width={14} height={14} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm leading-5">View as Markdown</div>
                <div className="text-xs text-gray-500 leading-4">View this page as plain text</div>
              </div>
            </Link>
          </div>
        </div>,
        document.body
      )}
    </Fragment>
  );
}
