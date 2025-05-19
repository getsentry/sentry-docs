'use client';

import {ReactNode, useEffect, useState} from 'react';
import {ChevronDownIcon, ChevronRightIcon} from '@radix-ui/react-icons';

// explicitly not usig CSS modules here
// because there's some prerendered content that depends on these exact class names
import '../callout/styles.scss';
import styles from './style.module.scss';

type Props = {
  children: ReactNode;
  title: string;
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

export function Expandable({title, level = 'info', children, permalink, group}: Props) {
  const id = permalink ? slugify(title) : undefined;

  const [isExpanded, setIsExpanded] = useState(false);

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

  function toggleIsExpanded(event: React.MouseEvent<HTMLDetailsElement>) {
    const newVal = event.currentTarget.open;
    setIsExpanded(newVal);

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
        {isExpanded ? (
          <ChevronDownIcon className="callout-icon" />
        ) : (
          <ChevronRightIcon className="callout-icon" />
        )}
        <div>{title}</div>
      </summary>
      <div className={`${styles['expandable-body']} callout-body content-flush-bottom`}>
        {children}
      </div>
    </details>
  );
}
