'use client';

import {RefObject, useEffect, useRef, useState} from 'react';
import {Clipboard} from 'react-feather';

import styles from './code-blocks.module.scss';

import {makeHighlightBlocks} from '../codeHighlights';
import {makeKeywordsClickable} from '../codeKeywords';

export interface CodeBlockProps {
  children: React.ReactNode;
  filename?: string;
  language?: string;
  title?: string;
}

export function CodeBlock({filename, language, children}: CodeBlockProps) {
  const [showCopied, setShowCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  // Show the copy button after js has loaded
  // otherwise the copy button will not work
  const [showCopyButton, setShowCopyButton] = useState(false);
  useEffect(() => {
    setShowCopyButton(true);
  }, []);

  useCleanSnippetInClipboard(codeRef, {language});

  async function copyCodeOnClick() {
    if (codeRef.current === null) {
      return;
    }

    const code = cleanCodeSnippet(codeRef.current.innerText, {language});

    try {
      await navigator.clipboard.writeText(code);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 1200);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to copy:', error);
    }
  }

  return (
    <div className={styles['code-block']}>
      <div className={styles['code-actions']}>
        <code className={styles.filename}>{filename}</code>
        {showCopyButton && (
          <button className={styles.copy} onClick={copyCodeOnClick}>
            <Clipboard size={16} />
          </button>
        )}
      </div>
      <div
        data-mdast="ignore"
        className={styles.copied}
        style={{opacity: showCopied ? 1 : 0}}
      >
        Copied
      </div>
      <div ref={codeRef}>
        {makeKeywordsClickable(makeHighlightBlocks(children, language))}
      </div>
    </div>
  );
}

interface CleanCopyOptions {
  cleanBashPrompt?: boolean;
  cleanDiffMarkers?: boolean;
  language?: string;
}

const REGEX = {
  DIFF_MARKERS: /^[+\-](?:\s|(?=\S))/gm, // Matches diff markers (+ or -) at the beginning of lines, with or without spaces
  BASH_PROMPT: /^\$\s*/, // Matches bash prompt ($ followed by a space)
  CONSECUTIVE_NEWLINES: /\n\n/g, // Matches consecutive newlines
};

/**
 * Cleans a code snippet by removing diff markers (+ or -) and bash prompts.
 *
 * @internal Only exported for testing
 */
export function cleanCodeSnippet(rawCodeSnippet: string, options?: CleanCopyOptions) {
  const language = options?.language;
  const cleanDiffMarkers = options?.cleanDiffMarkers ?? true;
  const cleanBashPrompt = options?.cleanBashPrompt ?? true;

  let cleanedSnippet = rawCodeSnippet.replace(REGEX.CONSECUTIVE_NEWLINES, '\n');

  if (cleanDiffMarkers) {
    cleanedSnippet = cleanedSnippet.replace(REGEX.DIFF_MARKERS, '');
  }

  if (cleanBashPrompt && (language === 'bash' || language === 'shell')) {
    // Split into lines, clean each line, then rejoin
    cleanedSnippet = cleanedSnippet
      .split('\n')
      .map(line => {
        const match = line.match(REGEX.BASH_PROMPT);
        return match ? line.substring(match[0].length) : line;
      })
      .filter(line => line.trim() !== '') // Remove empty lines
      .join('\n');
  }

  return cleanedSnippet;
}

/**
 * A custom hook that handles cleaning text when manually copying code to clipboard
 *
 * @param codeRef - Reference to the code element
 * @param options - Configuration options for cleaning
 */
export function useCleanSnippetInClipboard(
  codeRef: RefObject<HTMLElement | null>,
  options: CleanCopyOptions = {}
) {
  const {cleanDiffMarkers = true, cleanBashPrompt = true, language = ''} = options;

  useEffect(() => {
    const handleUserCopyEvent = (event: ClipboardEvent) => {
      if (!codeRef.current || !event.clipboardData) return;

      const selection = window.getSelection()?.toString() || '';

      if (selection) {
        const cleanedSnippet = cleanCodeSnippet(selection, options);

        event.clipboardData.setData('text/plain', cleanedSnippet);
        event.preventDefault();
      }
    };

    const codeElement = codeRef.current;
    if (codeElement) {
      codeElement.addEventListener('copy', handleUserCopyEvent as EventListener);
    }

    return () => {
      if (codeElement) {
        codeElement.removeEventListener('copy', handleUserCopyEvent as EventListener);
      }
    };
  }, [codeRef, cleanDiffMarkers, language, cleanBashPrompt, options]);
}
