import React from "react";

import CodeContext, { useCodeContextState } from "./codeContext";
import Markdown from "./markdown";

export default ({ file }) => {
  if (!file) return null;
  const child = file.childMarkdownRemark || file.childMdx;
  if (!child) return null;
  return (
    <CodeContext.Provider value={useCodeContextState()}>
      {child.internal.type === "Mdx" ? (
        <Markdown withoutCodeContext value={child.body} />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: child.html }} />
      )}
    </CodeContext.Provider>
  );
};
