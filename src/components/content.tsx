import React from "react";

import Markdown from "./markdown";

type FileNode = {
  childMarkdownRemark?: {
    html: any;
    internal: {
      type: string;
    };
  };
  childMdx?: {
    body: any;
    internal: {
      type: string;
    };
  };
};

type Props = {
  file: FileNode;
};

export default ({ file }: Props): JSX.Element | null => {
  if (!file) return null;
  const child = file.childMarkdownRemark || file.childMdx;
  if (!child) return null;
  if (file.childMarkdownRemark) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: file.childMarkdownRemark.html }}
      />
    );
  } else if (file.childMdx) {
    return <Markdown value={file.childMdx.body} />;
  }
  return null;
};
