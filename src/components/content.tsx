import React, { useEffect, useState } from "react";

import Markdown from "./markdown";

type FileNode = {
  childMarkdownRemark?: {
    html: any;
  };
  childMdx?: {
    body: any;
  };
};

type Props = {
  file: FileNode;
};

// https://github.com/gatsbyjs/gatsby/issues/12413
const RawHtml = ({ html }) => {
  const [innerHtml, setInnerHtml] = useState();

  useEffect(() => {
    setInnerHtml(html);
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: innerHtml }} />;
};

export default ({ file }: Props): JSX.Element | null => {
  if (!file) return null;
  const child = file.childMarkdownRemark || file.childMdx;
  if (!child) return null;
  if (file.childMarkdownRemark) {
    return <RawHtml html={file.childMarkdownRemark.html} />;
  } else if (file.childMdx) {
    return <Markdown value={file.childMdx.body} />;
  }
  return null;
};
