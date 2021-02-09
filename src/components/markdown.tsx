import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";

import "prismjs/themes/prism-tomorrow.css";

import Alert from "./alert";
import Break from "./break";
import SmartLink from "./smartLink";
import CodeBlock from "./codeBlock";
import CodeTabs from "./codeTabs";
import ConfigKey from "./configKey";
import GuideGrid from "./guideGrid";
import JsCdnTag from "./jsCdnTag";
import LambdaLayerDetail from "./lambdaLayerDetail";
import Note from "./note";
import PageGrid from "./pageGrid";
import ParamTable from "./paramTable";
import PlatformContent from "./platformContent";
import DefinitionList from "./definitionList";
import PlatformLink from "./platformLink";
import PlatformSection from "./platformSection";
import PlatformIdentifier from "./platformIdentifier";
import RelayMetrics from "./relayMetrics";

const mdxComponents = {
  Alert,
  a: SmartLink,
  Break,
  CodeBlock,
  CodeTabs,
  ConfigKey,
  GuideGrid,
  JsCdnTag,
  Link: SmartLink,
  Note,
  PageGrid,
  ParamTable,
  DefinitionList,
  PlatformContent,
  PlatformLink,
  PlatformSection,
  PlatformIdentifier,
  RelayMetrics,
  LambdaLayerDetail,
};

export default ({ value }) => {
  return (
    <MDXProvider components={mdxComponents}>
      <MDXRenderer>{value}</MDXRenderer>
    </MDXProvider>
  );
};
