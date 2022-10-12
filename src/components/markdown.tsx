import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";

import "prism-sentry/index.css";

import Alert from "./alert";
import Break from "./break";
import SmartLink from "./smartLink";
import CodeBlock from "./codeBlock";
import CodeTabs from "./codeTabs";
import ConfigKey from "./configKey";
import GuideGrid from "./guideGrid";
import GuideLink from "./guideLink";
import Include from "./include";
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
import SandboxLink, { SandboxOnly } from "./sandboxLink";
import { VimeoEmbed, YouTubeEmbed } from "./video";

const mdxComponents = {
  Alert,
  a: SmartLink,
  Break,
  CodeBlock,
  CodeTabs,
  ConfigKey,
  GuideGrid,
  GuideLink,
  Include,
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
  VimeoEmbed,
  YouTubeEmbed,
  SandboxLink,
  SandboxOnly,
};

export default ({ value }) => {
  return (
    <MDXProvider components={mdxComponents}>
      <MDXRenderer>{value}</MDXRenderer>
    </MDXProvider>
  );
};
