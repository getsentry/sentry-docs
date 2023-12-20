import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import { Alert } from "./alert";
import { Expandable } from "./expandable";
import { getFileBySlug } from "sentry-docs/mdx";
import { serverContext } from "sentry-docs/serverContext";
import { Note } from "./note";
import { PageGrid } from "./pageGrid";
import { PlatformGrid } from "./platformGrid";
import { PlatformLink } from "./platformLink";
import { MDXComponents } from "mdx/types";
import { SignInNote } from "./signInNote";
import { DefinitionList } from "./definitionList";
import { PlatformIdentifier } from "./platformIdentifier";
import { PlatformSection } from "./platformSection";
import { SandboxLink } from "./sandboxLink";
import { ConfigKey } from "./configKey";
import { Include } from "./include";
import { OrgAuthTokenNote } from "./orgAuthTokenNote";
import { SmartLink } from "./smartLink";
import { GuideGrid } from "./guideGrid";
import { LambdaLayerDetail } from "./lambdaLayerDetail";
import { Break } from "./break";
import { JsBundleList } from "./jsBundleList";
import { CliChecksumTable } from "./cliChecksumTable";
import { PiiFields } from "./piiFields";
import { ParamTable } from "./paramTable";
import { PlatformLinkWithLogo } from "./platformLinkWithLogo";
import { VimeoEmbed } from "./video";
import { RelayMetrics } from "./relayMetrics";

type Props = {
  includePath: string;
  children?: React.ReactNode;
  fallbackPlatform?: string;
  noGuides?: boolean;
  platform?: string;
};

export async function PlatformContent({includePath, platform, children, noGuides}: Props) {
  const { path } = serverContext();
  
  if (!platform) {
    if (path.length < 2 || path[0] !== 'platforms') {
      return null;
    }
    platform = path[1]
  }

  let doc: any = null;
  try {
    doc = await getFileBySlug(`platform-includes/${includePath}/${platform}`);
  } catch (e) {
    if (e.code === 'ENOENT') {
      try {
        doc = await getFileBySlug(`platform-includes/${includePath}/_default`);
      } catch (e2) {
        if (e2.code === 'ENOENT') {
          return null;
        } else {
          throw(e);
        }
      }
    } else {
      throw(e);
    }
  }
  const { mdxSource } = doc;
  const MDXLayoutRenderer = ({ mdxSource, ...rest }) => {
    const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])
    return <MDXLayout components={MDXComponents} {...rest} />;
  }
  return <MDXLayoutRenderer mdxSource={mdxSource} />;
}

const MDXComponents: MDXComponents = {
  Alert,
  Break,
  CliChecksumTable,
  ConfigKey,
  DefinitionList,
  Expandable,
  GuideGrid,
  Include,
  JsBundleList,
  LambdaLayerDetail,
  Link: SmartLink,
  Note,
  OrgAuthTokenNote,
  PageGrid,
  ParamTable,
  PiiFields,
  PlatformContent,
  PlatformGrid,
  PlatformIdentifier,
  PlatformLink,
  PlatformLinkWithLogo,
  PlatformSection,
  RelayMetrics,
  SandboxLink,
  SignInNote,
  VimeoEmbed,
  // a: Link, // TODO: fails type check
  wrapper: ({ children }) => children
}
