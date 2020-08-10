import React from "react";

import Markdown from "./markdown";

export default ({ file }) => {
  if (!file) return null;
  const child = file.childMarkdownRemark || file.childMdx;
  if (!child) return null;
  return child.internal.type === "Mdx" ? (
    <Markdown value={child.body} />
  ) : (
    <div dangerouslySetInnerHTML={{ __html: child.html }} />
  );
};
