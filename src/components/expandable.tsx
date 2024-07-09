'use client';

import {ReactNode, useEffect, useState} from 'react';
import {ArrowDown} from 'react-feather';
import styled from '@emotion/styled';

type Props = {
  children: ReactNode;
  title: string;
  permalink?: boolean;
};

type ExpandedProps = {
  isExpanded: boolean;
};

const ExpandedIndicator = styled(({isExpanded: _, ...props}) => (
  <ArrowDown {...props} />
))<ExpandedProps>`
  user-select: none;
  transition: transform 200ms ease-in-out;
  transform: rotate(${p => (p.isExpanded ? '180deg' : '0')});
  stroke-width: 3px;
  position: absolute;
  right: 0;
  top: 4px;
`;

const ExpandableBody = styled.div<ExpandedProps>`
  display: ${props => (props.isExpanded ? 'block' : 'none')};
`;

const ExpandableWrapper = styled.div`
  background: var(--accent-2);
  border-color: var(--accent-12);
  border-left: 3px solid var(--accent-12);
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
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
        className="!text-[1rem] !font-medium hover:!no-underline !text-darkPurple"
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
  }, []);

  return (
    <ExpandableWrapper>
      <p
        className="m-0 font-medium cursor-pointer relative pr-8 select-none"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        {header(title, permalink)}
        <ExpandedIndicator isExpanded={isExpanded} />
      </p>
      <ExpandableBody isExpanded={isExpanded}>{children}</ExpandableBody>
    </ExpandableWrapper>
  );
}
