import React from 'react';

type Props = {
  children?: any;
};

export default function Note({children}: Props): JSX.Element {
  //   let className = "";
  //   if (children.props && typeof children.props.children === "string") {
  //     className += " markdown-text-only";
  //   }
  return (
    <div role="alert" className="note">
      <div className="note-body">{children}</div>
    </div>
  );
}
