'use client';

import {ReactNode, useEffect, useState} from 'react';
import {ArrowDown} from 'react-feather';
import styled from '@emotion/styled';

type Props = {
  children: ReactNode;
  title: string;
  permalink?: boolean;
};

const Arrow = styled(({...props}) => <ArrowDown {...props} />)<{className: string}>`
  user-select: none;
  transition: transform 200ms ease-in-out;
  stroke-width: 3px;
  position: absolute;
  right: 0;
  top: 4px;
`;

const Details = styled.details`
  background: var(--accent-2);
  border-color: var(--accent-12);
  border-left: 3px solid var(--accent-12);
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  h2 {
    margin-top: 0;
  }
  &[open] .expandable-arrow {
    transform: rotate(180deg);
  }
`;

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const header = (title: string, permalink?: boolean) =>
  permalink ? (
    <h2 id={slugify(title)} className="!mb-0">
      <a
        href={'#' + slugify(title)}
        className="w-full !text-[1rem] !font-medium hover:!no-underline !text-[var(--foreground)]"
      >
        {title}
      </a>
    </h2>
  ) : (
    title
  );

export function Expandable({title, children, permalink}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // if the url hash matches the title, expand the section
    if (permalink && window.location.hash === `#${slugify(title)}`) {
      setIsExpanded(true);
    }
    const onHashChange = () => {
      if (window.location.hash === `#${slugify(title)}`) {
        setIsExpanded(true);
      }
    };
    // listen for hash changes and expand the section if the hash matches the title
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [title, permalink]);

  return (
    <Details open={isExpanded}>
      <summary className="m-0 font-medium cursor-pointer relative pr-8 select-none appearance-none list-none">
        {header(title, true)}
        <Arrow className="expandable-arrow" />
      </summary>
      {children}
    </Details>
  );
}
