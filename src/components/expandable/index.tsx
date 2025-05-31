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
  copy?: boolean;
  /** If defined, the expandable will be grouped with other expandables that have the same group. */
  group?: string;
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

      if (contentRef.current === null) {
        return;
      }

      emit('Copy Expandable Content', {props: {page: window.location.pathname, title}});

      // Attempt to get text from markdown code blocks if they exist
      const codeBlocks = contentRef.current.querySelectorAll('code');
      let contentToCopy = '';

      if (codeBlocks.length > 0) {
        // If there are code blocks, concatenate their text content
        codeBlocks.forEach(block => {
          // Exclude code elements within other code elements (e.g. inline code in a block)
          if (!block.closest('code')?.parentElement?.closest('code')) {
            contentToCopy += (block.textContent || '') + '\n';
          }
        });
        contentToCopy = contentToCopy.trim();
      }

      // Fallback to the whole content if no code blocks or if they are empty
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
    [emit, title]
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
            {!copied && 'Copy Rules'}
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
