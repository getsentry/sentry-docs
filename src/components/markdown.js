import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";

import "prismjs/themes/prism-tomorrow.css";

import Alert from "./alert";
import Break from "./break";
import SmartLink from "./smartLink";
import CodeBlock from "./codeBlock";
import CodeTabs from "./codeTabs";
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

export default ({ value }) => {
  return (
    <MDXProvider components={mdxComponents}>
      <MDXRenderer>{value}</MDXRenderer>
    </MDXProvider>
  );
};
