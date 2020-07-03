import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";

import "prismjs/themes/prism-tomorrow.css";

import Alert from "./alert";
import Break from "./break";
import SmartLink from "./smartLink";
import CodeBlock from "./codeBlock";
import CodeTabs from "./codeTabs";
import CodeContext, { useCodeContextState } from "./codeContext";
import JsCdnTag from "./jsCdnTag";
import ParamTable from "./paramTable";
import PlatformContent from "./platformContent";

const mdxComponents = {
  Alert,
  a: SmartLink,
  Link: SmartLink,
  CodeBlock,
  CodeTabs,
  Break,
  ParamTable,
  PlatformContent,
  JsCdnTag
};

export default ({ file }) => {
  const child = file.childMarkdownRemark || file.childMdx;
  if (!child) return null;
  return (
    <CodeContext.Provider value={useCodeContextState()}>
      {child.internal.type === "Mdx" ? (
        <MDXProvider components={mdxComponents}>
          <MDXRenderer>{child.body}</MDXRenderer>
        </MDXProvider>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: child.html }} />
      )}
    </CodeContext.Provider>
  );
};
