"use client";

/* eslint-disable simple-import-sort/imports */

import {useState, useCallback, Fragment} from 'react';

import {ClipboardCopyIcon, CheckIcon} from '@radix-ui/react-icons';
import {createPortal} from 'react-dom';

/**
 * A small utility button that copies the visible content of the current documentation page
 * into the user clipboard so it can be pasted into an LLM prompt.
 *
 * UX: After clicking the button, the label briefly changes to “Copied ✓” to confirm success.
 */
export default function CopyForLLMButton() {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      // Gather the main content of the doc page. We intentionally
      // grab markdown-friendly plain-text by using innerText.
      const mainElement = document.getElementById('main');
      const title = document.querySelector('h1')?.textContent ?? '';
      const description = document.querySelector('h2')?.textContent ?? '';
      const body = mainElement?.innerText ?? '';
      const textToCopy = `${title}\n\n${description}\n\n${body}`.trim();

      await navigator.clipboard.writeText(textToCopy);

      // Show confirmation
      setCopied(true);
      setShowToast(true);

      // Hide confirmation after 2 seconds
      setTimeout(() => {
        setCopied(false);
        setShowToast(false);
      }, 2000);
    } catch {
      /* ignore clipboard errors */
    }
  }, []);

  return (
    <Fragment>
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Copy page content for LLM'}
        aria-label="Copy for LLM"
        className="float-right mr-[5px] flex items-center justify-center text-[var(--gray-12)] hover:text-[var(--accent)] focus:outline-none"
        data-mdast="ignore"
      >
        {copied ? (
          <CheckIcon width="24" height="24" />
        ) : (
          <ClipboardCopyIcon width="24" height="24" />
        )}
      </button>

      {showToast &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[var(--gray-2)] text-[var(--gray-12)] border border-[var(--gray-a4)] px-4 py-2 rounded shadow-lg z-50">
            Copied to clipboard
          </div>,
          document.body
        )}
    </Fragment>
  );
}