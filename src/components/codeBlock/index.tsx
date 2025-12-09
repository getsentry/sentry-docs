'use client';

import {RefObject, useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Clipboard, ExternalLink} from 'react-feather';

import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';
import {DocMetrics} from 'sentry-docs/metrics';

import styles from './code-blocks.module.scss';

import {CodeContext} from '../codeContext';
import {makeHighlightBlocks} from '../codeHighlights';
import {makeKeywordsClickable} from '../codeKeywords';
import {updateElementsVisibilityForOptions} from '../onboarding';

export interface CodeBlockProps {
  children: React.ReactNode;
  externalLink?: string;
  filename?: string;
  language?: string;
  title?: string;
}

/**
 *
 * Copy `element`'s text children as long as long as they are not `.no-copy`
 */
function getCopiableText(element: HTMLDivElement) {
  let text = '';
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      let parent = node.parentElement;
      // Walk up the tree to check if any parent has .no-copy, .hidden, or data-onboarding-option-hidden
      while (parent && parent !== element) {
        if (
          parent.classList.contains('no-copy') ||
          parent.classList.contains('hidden') ||
          parent.hasAttribute('data-onboarding-option-hidden')
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        parent = parent.parentElement;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node: Node | null;
  // eslint-disable-next-line no-cond-assign
  while ((node = walker.nextNode())) {
    text += node.textContent;
  }

  return text.trim();
}

export function CodeBlock({filename, language, children, externalLink}: CodeBlockProps) {
  const [showCopied, setShowCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);
  const codeContext = useContext(CodeContext);

  // Show the copy button after js has loaded
  // otherwise the copy button will not work
  const [showCopyButton, setShowCopyButton] = useState(false);
  // Track if component is mounted to prevent hydration mismatch with keyword interpolation
  const [isMounted, setIsMounted] = useState(false);
  const {emit} = usePlausibleEvent();

  useEffect(() => {
    setShowCopyButton(true);
    setIsMounted(true);
    // prevent .no-copy elements from being copied during selection Right click copy or / Cmd+C
    const noCopyElements = codeRef.current?.querySelectorAll<HTMLSpanElement>('.no-copy');
    const handleSelectionChange = () => {
      // hide no copy elements within the selection
      const selection = window.getSelection();
      noCopyElements?.forEach(element => {
        if (selection?.containsNode(element, true)) {
          element.style.display = 'none';
        } else {
          element.style.display = 'inline';
        }
      });
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  // Re-sync onboarding visibility after keyword interpolation recreates DOM nodes.
  // makeKeywordsClickable clones elements, losing .hidden classes. useLayoutEffect
  // corrects this synchronously before paint to prevent visible flicker.
  useLayoutEffect(() => {
    if (isMounted && codeContext?.onboardingOptions) {
      updateElementsVisibilityForOptions(codeContext.onboardingOptions, false);
    }
  }, [isMounted, codeContext?.onboardingOptions]);

  useCleanSnippetInClipboard(codeRef, {language});

  // Mermaid blocks should not be processed by CodeBlock - they need special client-side rendering
  if (language === 'mermaid') {
    return <div className="language-mermaid">{children}</div>;
  }

  async function copyCodeOnClick() {
    if (codeRef.current === null) {
      return;
    }

    const code = cleanCodeSnippet(getCopiableText(codeRef.current), {
      language,
    });

    try {
      await navigator.clipboard.writeText(code);
      setShowCopied(true);
      emit('copy sentry code', {props: {page: window.location.pathname}});

      // Track snippet copy with metadata
      DocMetrics.snippetCopy(window.location.pathname, language, filename);

      setTimeout(() => setShowCopied(false), 1200);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to copy:', error);
    }
  }

  // Process children to add highlighting
  const highlightedChildren = makeHighlightBlocks(children, language);

  // Only apply keyword interpolation after component mounts to prevent hydration mismatch
  // Server and client both render raw text initially, then client upgrades after mount
  const processedChildren = isMounted
    ? makeKeywordsClickable(highlightedChildren)
    : highlightedChildren;

  return (
    <div className={styles['code-block']}>
      <div className={styles['code-actions']}>
        <code className={styles.filename}>{filename}</code>
        {showCopyButton && (
          <button className={styles.copy} onClick={copyCodeOnClick}>
            <Clipboard size={16} />
          </button>
        )}
        {externalLink && (
          <a
            href={externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.copy}
            title="View Github Source"
          >
            <ExternalLink size={16} />
          </a>
        )}
      </div>
      <div
        data-mdast="ignore"
        className={styles.copied}
        style={{opacity: showCopied ? 1 : 0}}
      >
        Copied
      </div>
      <div ref={codeRef}>{processedChildren}</div>
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
