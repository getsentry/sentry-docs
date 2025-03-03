'use client';

import {RefObject, useEffect, useRef, useState} from 'react';
import {Clipboard} from 'react-feather';

import styles from './code-blocks.module.scss';

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

  const {copyCodeOnClick} = useCopyCodeCleaner(codeRef, {
    cleanDiffMarkers: true,
    language,
  });

  // Show the copy button after js has loaded
  // otherwise the copy button will not work
  const [showCopyButton, setShowCopyButton] = useState(false);
  useEffect(() => {
    setShowCopyButton(true);
  }, []);

  const handleCopyOnClick = async () => {
    const success = await copyCodeOnClick();

    if (success) {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 1200);
    }
  };

  return (
    <div className={styles['code-block']}>
      <div className={styles['code-actions']}>
        <code className={styles.filename}>{filename}</code>
        {showCopyButton && (
          <button className={styles.copy} onClick={handleCopyOnClick}>
            <Clipboard size={16} />
          </button>
        )}
      </div>
      <div className={styles.copied} style={{opacity: showCopied ? 1 : 0}}>
        Copied
      </div>
      <div ref={codeRef}>{makeKeywordsClickable(children)}</div>
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
 * A custom hook that handles cleaning text when copying from code blocks
 * @param codeRef - Reference to the code element
 * @param options - Configuration options for cleaning
 */
export function useCopyCodeCleaner(
  codeRef: RefObject<HTMLElement>,
  options: CleanCopyOptions = {}
) {
  const {cleanDiffMarkers = true, cleanBashPrompt = true, language = ''} = options;

  /**
   *   Effect, which cleans the snippet when the user manually copies it to their clipboard
   */
  useEffect(() => {
    const handleUserCopyEvent = (event: ClipboardEvent) => {
      if (!codeRef.current || !event.clipboardData) return;

      const selection = window.getSelection()?.toString() || '';

      if (selection) {
        let cleanedText = selection;

        if (cleanDiffMarkers) {
          cleanedText = cleanedText.replace(REGEX.DIFF_MARKERS, '');
        }

        if (cleanBashPrompt && (language === 'bash' || language === 'shell')) {
          const match = cleanedText.match(REGEX.BASH_PROMPT);
          if (match) {
            cleanedText = cleanedText.substring(match[0].length);
          }
        }

        event.clipboardData.setData('text/plain', cleanedText);
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
  }, [codeRef, cleanDiffMarkers, language, cleanBashPrompt]);

  /**
   * Function for copying code when clicking on "copy code".
   *
   * @returns Whether code was copied successfully
   */
  const copyCodeOnClick = async (): Promise<boolean> => {
    if (codeRef.current === null) {
      return false;
    }

    let code = codeRef.current.innerText.replace(REGEX.CONSECUTIVE_NEWLINES, '\n');

    if (cleanBashPrompt && (language === 'bash' || language === 'shell')) {
      const match = code.match(REGEX.BASH_PROMPT);
      if (match) {
        code = code.substring(match[0].length);
      }
    }

    if (cleanDiffMarkers) {
      code = code.replace(REGEX.DIFF_MARKERS, '');
    }

    try {
      await navigator.clipboard.writeText(code);
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to copy:', error);
      return false;
    }
  };

  return {copyCodeOnClick};
}
