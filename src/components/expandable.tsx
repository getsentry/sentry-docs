'use client';

import {ReactNode, useEffect, useState} from 'react';
import {ChevronDownIcon, ChevronRightIcon} from '@radix-ui/react-icons';

import {Callout} from './callout';

type Props = {
  children: ReactNode;
  title: string;
  level?: 'info' | 'warning' | 'success';
  permalink?: boolean;
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function Expandable({title, level, children, permalink}: Props) {
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

  function toggleIsExpanded() {
    const newVal = !isExpanded;

    if (id) {
      if (newVal) {
        window.history.pushState({}, '', `#${id}`);
      } else {
        window.history.pushState({}, '', '#');
      }
    }

    setIsExpanded(newVal);
  }

  return (
    <Callout
      level={level}
      title={title}
      Icon={isExpanded ? ChevronDownIcon : ChevronRightIcon}
      id={id}
      titleOnClick={toggleIsExpanded}
    >
      {isExpanded ? children : undefined}
    </Callout>
  );
}
