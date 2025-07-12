'use client';

import {useState} from 'react';
import {Clipboard, Check} from 'react-feather';

interface Props {
  /** Absolute path to the markdown version of this page (e.g. `/docs/page.md`) */
  markdownPath: string;
}

export function CopyForLLMButton({markdownPath}: Props) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    let didCopy = false;

    // First attempt: fetch markdown file and copy its contents
    try {
      const response = await fetch(markdownPath);
      if (response.ok) {
        const text = await response.text();
        await navigator.clipboard.writeText(text);
        didCopy = true;
      }
    } catch (err) {
      // network error handled below in fallback
      console.error(err);
    }

    // Fallback: copy the markdown URL if first attempt failed
    if (!didCopy) {
      try {
        await navigator.clipboard.writeText(window.location.origin + markdownPath);
        didCopy = true;
      } catch (err) {
        console.error('Failed to copy markdown URL as fallback', err);
      }
    }

    // Visual feedback only when something was actually copied
    if (didCopy) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title="Copy page content for LLM"
      className="mr-2 float-right flex items-center gap-1 border rounded px-2 py-1 text-xs hover:bg-[var(--gray-2)]"
      data-mdast="ignore"
    >
      {copied ? (
        <Check size={14} />
      ) : (
        <Clipboard size={14} />
      )}
      <span className="whitespace-nowrap">Copy for LLM</span>
    </button>
  );
}