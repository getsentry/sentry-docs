import React, { useState } from "react";
import styled from "@emotion/styled";
import { ArrowDown } from "react-feather";

type Props = {
  title: string;
  children: any;
};

type ExpandedProps = {
  isExpanded: boolean;
};

const ExpandedIndicator = styled(ArrowDown)<ExpandedProps>`
  user-select: none;
  transition: transform 200ms ease-in-out;
  transform: rotate(${p => (p.isExpanded ? "180deg" : "0")});
  stroke-width: 3px;
`;

const ExpandableBody = styled.div<ExpandedProps>`
  display: ${props => (props.isExpanded ? "block" : "none")};
`;

export default ({ title, children }: Props): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="note">
      <p
        className="note-header expandable-header"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        {title}
        <ExpandedIndicator
          className="expandable-header-arrow"
          isExpanded={isExpanded}
        />
      </p>
      <ExpandableBody isExpanded={isExpanded}>{children}</ExpandableBody>
    </div>
  );
};
