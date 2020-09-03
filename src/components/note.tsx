import React from "react";
import styled from "@emotion/styled";

type Props = {
  children?: any;
};

const Note = styled.div`
  color: var(--light-text);
  font-style: italic;
`;

const NoteBody = styled.div``;

export default ({ children }: Props): JSX.Element => {
  //   let className = "";
  //   if (children.props && typeof children.props.children === "string") {
  //     className += " markdown-text-only";
  //   }
  return (
    <Note role="alert">
      <NoteBody>{children}</NoteBody>
    </Note>
  );
};
