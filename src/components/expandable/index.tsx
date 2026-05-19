'use client';

// explicitly not using CSS modules here
// because there's some prerendered content that depends on these exact class names
import '../callout/styles.scss';

import {ChevronDownIcon, ChevronRightIcon} from '@radix-ui/react-icons';
import * as Sentry from '@sentry/nextjs';
import {ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';

import styles from './style.module.scss';

type Props = {
  children: ReactNode;
  title: string;
  /** If true, shows "Copy Rules" button. If a string, uses it as the button label. */
  copy?: boolean | string;
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
  hideFromMd = false,
}: Props) {
  const id = permalink ? slugify(title) : undefined;

  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const {emit} = usePlausibleEvent();

  const detailsRef = useRef<HTMLDetailsElement>(null);
  const scrollTargetRef = useRef<string | null>(null);
  const expandedByHashRef = useRef(false);

  // Expand when the URL hash matches this expandable's id
  // OR any element inside it (e.g. a heading anchor within the content).
  useEffect(() => {
    const expandIfHashInside = () => {
      const hash = window.location.hash;
      if (!hash) {
        return;
      }
      const targetId = hash.slice(1);
      if (!targetId) {
        return;
      }

      const isOwnId = targetId === id;
      const targetElement = document.getElementById(targetId);
      const containsTarget = targetElement && detailsRef.current?.contains(targetElement);

      if (isOwnId || containsTarget) {
        if (detailsRef.current?.open) {
          document.getElementById(targetId)?.scrollIntoView();
        } else {
          expandedByHashRef.current = true;
          scrollTargetRef.current = targetId;
          setIsExpanded(true);
        }
      }
    };

    expandIfHashInside();
    window.addEventListener('hashchange', expandIfHashInside);
    return () => {
      window.removeEventListener('hashchange', expandIfHashInside);
    };
  }, [id]);

  // Scroll after React commits the expanded state and the browser lays out.
  useEffect(() => {
    if (isExpanded && scrollTargetRef.current) {
      const targetId = scrollTargetRef.current;
      scrollTargetRef.current = null;
      requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView();
      });
    }
  }, [isExpanded]);

  const copyContentOnClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation(); // Prevent the details element from toggling
      event.preventDefault(); // Prevent default summary click behavior

      // Expand the section so the user can see what was copied
      setIsExpanded(true);

      if (contentRef.current === null) {
        return;
      }

      emit('Copy Expandable Content', {props: {page: window.location.pathname, title}});

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
    [copy, emit, title]
  );

  function toggleIsExpanded(event: React.MouseEvent<HTMLDetailsElement>) {
    const newVal = event.currentTarget.open;
    setIsExpanded(newVal);

    // Don't emit analytics or overwrite the hash when triggered by hash navigation
    if (newVal && !expandedByHashRef.current) {
      emit('Open Expandable', {props: {page: window.location.pathname, title}});
    }

    if (id && !expandedByHashRef.current) {
      if (newVal) {
        window.history.pushState({}, '', `#${id}`);
      } else {
        window.history.pushState({}, '', '#');
      }
    }
    expandedByHashRef.current = false;
  }

  return (
    <details
      ref={detailsRef}
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
            {!copied && (typeof copy === 'string' ? copy : 'Copy Rules')}
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
