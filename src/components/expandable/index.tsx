'use client';

import {ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import {ChevronDownIcon, ChevronRightIcon} from '@radix-ui/react-icons';
import * as Sentry from '@sentry/nextjs';

import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';

// explicitly not using CSS modules here
// because there's some prerendered content that depends on these exact class names
import '../callout/styles.scss';
import styles from './style.module.scss';

type Props = {
  children: ReactNode;
  title: string;
  /** If true, shows "Copy Rules" button. If a string, uses it as the button label. */
  copy?: boolean | string;
  /** Which Plausible event to emit when the copy button is clicked. */
  copyEventName?: 'Copy Expandable Content' | 'Copy AI Prompt';
  /** Label for the copy button. Defaults to "Copy Rules". */
  copyLabel?: string;
  /** If defined, the expandable will be grouped with other expandables that have the same group. */
  group?: string;
  // If true, the expandable will not be rendered in the markdown version of the page
  hideFromMd?: boolean;
  level?: 'info' | 'warning' | 'success';
  permalink?: boolean;
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function Expandable({
  title,
  level = 'info',
  children,
  permalink,
  group,
  copy,
  copyEventName = 'Copy Expandable Content',
  copyLabel = 'Copy Rules',
  hideFromMd = false,
}: Props) {
  const id = permalink ? slugify(title) : undefined;

  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const {emit} = usePlausibleEvent();

  // Ensure we scroll to the element if the URL hash matches
  useEffect(() => {
    if (!id) {
      return () => {};
    }

    if (window.location.hash === `#${id}`) {
      document.querySelector(`#${id}`)?.scrollIntoView();
      setIsExpanded(true);
    }

    // When the hash changes (e.g. when the back/forward browser buttons are used),
    // we want to ensure to jump to the correct section
    const onHashChange = () => {
      if (window.location.hash === `#${id}`) {
        setIsExpanded(true);
        document.querySelector(`#${id}`)?.scrollIntoView();
      }
    };
    // listen for hash changes and expand the section if the hash matches the title
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [id]);

  const copyContentOnClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation(); // Prevent the details element from toggling
      event.preventDefault(); // Prevent default summary click behavior

      // Expand the section so the user can see what was copied
      setIsExpanded(true);

      if (contentRef.current === null) {
        return;
      }

      emit(copyEventName, {props: {page: window.location.pathname, title}});

      // First, try to get text from main code blocks (those inside pre elements)
      const preCodeBlocks = contentRef.current.querySelectorAll('pre code');
      let contentToCopy = '';

      if (preCodeBlocks.length > 0) {
        if (typeof copy === 'string') {
          // When using a custom copy label, copy only the first code block (primary install command)
          contentToCopy = (preCodeBlocks[0].textContent || '').trim();
        } else {
          // Default behavior: concatenate all code blocks
          preCodeBlocks.forEach(block => {
            contentToCopy += (block.textContent || '') + '\n';
          });
          contentToCopy = contentToCopy.trim();
        }
      } else {
        // Fallback: Look for large standalone code blocks (not inline code)
        const allCodeBlocks = contentRef.current.querySelectorAll('code');
        const largeCodeBlocks = Array.from(allCodeBlocks).filter((block: Element) => {
          // Skip inline code (usually short and inside paragraphs)
          const isInlineCode =
            block.closest('p') !== null && (block.textContent?.length || 0) < 100;
          return !isInlineCode;
        });

        if (largeCodeBlocks.length > 0) {
          contentToCopy = largeCodeBlocks
            .map((block: Element) => block.textContent || '')
            .join('\n')
            .trim();
        }
      }

      // Final fallback to the whole content if no code blocks or if they are empty
      if (!contentToCopy && contentRef.current.textContent) {
        contentToCopy = contentRef.current.textContent.trim();
      }

      if (!contentToCopy) {
        // if there is no content to copy (e.g. only images), do nothing.
        return;
      }

      try {
        setCopied(false);
        await navigator.clipboard.writeText(contentToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch (error) {
        Sentry.captureException(error);
        setCopied(false);
      }
    },
    [copy, emit, title, copyEventName]
  );

  function toggleIsExpanded(event: React.MouseEvent<HTMLDetailsElement>) {
    const newVal = event.currentTarget.open;
    setIsExpanded(newVal);

    if (newVal) {
      emit('Open Expandable', {props: {page: window.location.pathname, title}});
    }

    if (id) {
      if (newVal) {
        window.history.pushState({}, '', `#${id}`);
      } else {
        window.history.pushState({}, '', '#');
      }
    }
  }

  return (
    <details
      name={group}
      className={`${styles.expandable} callout !block ${'callout-' + level}`}
      open={isExpanded}
      onToggle={toggleIsExpanded}
      id={id}
      {...(hideFromMd ? {'data-mdast': 'ignore'} : {})}
    >
      <summary className={`${styles['expandable-header']} callout-header`}>
        <div className={styles['expandable-title-container']}>
          {isExpanded ? (
            <ChevronDownIcon className="callout-icon" />
          ) : (
            <ChevronRightIcon className="callout-icon" />
          )}
          <div>{title}</div>
        </div>
        {copy && (
          <button
            className={styles['copy-button']}
            onClick={copyContentOnClick}
            type="button" // Important for buttons in summaries
          >
            {!copied && (typeof copy === 'string' ? copy : copyLabel)}
            {copied && 'Copied!'}
          </button>
        )}
      </summary>
      <div
        ref={contentRef}
        className={`${styles['expandable-body']} callout-body content-flush-bottom`}
      >
        {children}
      </div>
    </details>
  );
}
