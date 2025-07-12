'use client';

import {useState} from 'react';
import {Check,Clipboard} from 'react-feather';
import * as Sentry from '@sentry/nextjs';

async function tryWriteClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    Sentry.captureException(err);
  }
  return false;
}

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
        didCopy = await tryWriteClipboard(text);
      }
    } catch (err) {
      // network error handled below in fallback
      Sentry.captureException(err);
    }

    // Fallback: copy the markdown URL if first attempt failed
    if (!didCopy) {
      try {
        didCopy = await tryWriteClipboard(window.location.origin + markdownPath);
      } catch (err) {
        Sentry.captureException(err);
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
      {copied ? <Check size={14} /> : <Clipboard size={14} />}
      <span className="whitespace-nowrap">Copy for LLM</span>
    </button>
  );
}
