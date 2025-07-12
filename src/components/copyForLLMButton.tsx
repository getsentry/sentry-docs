"use client";

import {useState, useCallback} from 'react';

/**
 * A small utility button that copies the visible content of the current documentation page
 * into the user clipboard so it can be pasted into an LLM prompt.
 *
 * UX: After clicking the button, the label briefly changes to “Copied ✓” to confirm success.
 */
export default function CopyForLLMButton() {
  const [copied, setCopied] = useState(false);

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
      // Hide confirmation after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy content for LLM', err);
    }
  }, []);

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy page content for LLM"
      className="float-right mr-2 px-2 py-1 rounded border border-transparent text-sm hover:underline focus:outline-none"
      data-mdast="ignore"
    >
      {copied ? 'Copied ✓' : 'Copy for LLM'}
    </button>
  );
}