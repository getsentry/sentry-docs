import React from "react";
import styled from "@emotion/styled";
import "../css/screen.scss";

type Props = {
  children?: any;
};

const Note = styled.div``;

const NoteBody = styled.div``;

export default ({ children }: Props): JSX.Element => {
  //   let className = "";
  //   if (children.props && typeof children.props.children === "string") {
  //     className += " markdown-text-only";
  //   }
  return (
    <Note role="alert" className="note">
      <NoteBody className="note-body">{children}</NoteBody>
    </Note>
  );
};
