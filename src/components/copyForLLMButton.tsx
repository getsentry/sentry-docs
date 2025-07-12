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
    try {
      // Attempt to fetch the markdown content and copy it
      const response = await fetch(markdownPath);
      const text = await response.text();
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Fallback: copy the markdown url itself
      await navigator.clipboard.writeText(window.location.origin + markdownPath);
    } finally {
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