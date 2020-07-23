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
import Include from "./include";

const mdxComponents = {
  Alert,
  a: SmartLink,
  Link: SmartLink,
  CodeBlock,
  CodeTabs,
  Break,
  ParamTable,
  PlatformContent,
  Include,
  JsCdnTag
};

function replaceVars(content, replaceObject) {
  for (let [key, value] of Object.entries(replaceObject || {})) {
    content = content.replace(new RegExp(`@@@${key}@@@`, 'g'), value);
  }
  return content;
}

export default ({ file, replacePlaceholder, ...args }) => {
  const child = file.childMarkdownRemark || file.childMdx;
  if (!child) return null;
  return (
    <CodeContext.Provider value={useCodeContextState()}>
      {child.internal.type === "Mdx" ? (
        <MDXProvider components={mdxComponents}>
          <MDXRenderer>
            {replaceVars(child.body, replacePlaceholder)}
          </MDXRenderer>
        </MDXProvider>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: replaceVars(child.html, replacePlaceholder) }} />
      )}
    </CodeContext.Provider>
  );
};
