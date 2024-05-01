'use client';

import {ReactNode, useState} from 'react';
import {ArrowDown} from 'react-feather';
import styled from '@emotion/styled';

type Props = {
  children: ReactNode;
  title: string;
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

export function Expandable({title, children}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <ExpandableWrapper>
      <p
        className="m-0 font-medium cursor-pointer relative pr-8"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        {title}
        <ExpandedIndicator isExpanded={isExpanded} />
      </p>
      <ExpandableBody isExpanded={isExpanded}>{children}</ExpandableBody>
    </ExpandableWrapper>
  );
}
