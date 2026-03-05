'use client';

import {useEffect, useRef, useState} from 'react';
import {Button} from '@radix-ui/themes';

type MarkdownButtonClientProps = {
  markdownContent: string | null;
};

export function MarkdownButtonClient({markdownContent}: MarkdownButtonClientProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isMarkdownAvailable = !!markdownContent;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCopyMarkdown = async () => {
    if (!markdownContent) return;

    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setShowDropdown(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      return;
    }
  };

  const handleViewMarkdown = () => {
    if (!markdownContent) return;

    const blob = new Blob([markdownContent], {type: 'text/markdown'});
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="markdown-button-container">
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="ghost"
          color="gray"
          size="4"
          radius="medium"
          onClick={toggleDropdown}
          className={`inline-flex items-center px-4 py-2 font-medium rounded-md ${
            isMarkdownAvailable
              ? ' text-white'
              : ' text-white opacity-50 cursor-not-allowed'
          }`}
          aria-label="Copy Page"
          disabled={!isMarkdownAvailable}
        >
          {copied ? 'Copied!' : isMarkdownAvailable ? 'Copy Page' : 'Copy Unavailable'}
          <svg
            className="w-4 h-4 ml-1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>

        {showDropdown && (
          <div className="absolute right-0 mt-1 w-72 bg-black rounded-md shadow-lg z-10 border border-gray-700">
            <button
              onClick={handleCopyMarkdown}
              className="w-full text-left px-4 py-3 text-white hover:bg-gray-800 flex items-start"
              disabled={!isMarkdownAvailable}
            >
              <div>
                <div className="font-medium">Copy Page as Markdown</div>
                <div className="text-sm text-gray-400">
                  Copy the raw Markdown content to clipboard
                </div>
              </div>
            </button>

            <button
              onClick={handleViewMarkdown}
              className="w-full text-left px-4 py-3 text-white hover:bg-gray-800 flex items-start"
              disabled={!isMarkdownAvailable}
            >
              <div>
                <div className="font-medium">View Page as Markdown</div>
                <div className="text-sm text-gray-400">
                  Open the Markdown file in a new tab
                </div>
              </div>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .markdown-button-container {
          position: relative;
        }
      `}</style>
    </div>
  );
}
