import 'prism-sentry/index.css';

import React from 'react';
import {MDXProvider} from '@mdx-js/react';
import {MDXRenderer} from 'gatsby-plugin-mdx';

import {Alert} from './alert';
import {Break} from './break';
import {CodeBlock} from './codeBlock';
import {CodeTabs} from './codeTabs';
import {ConfigKey} from './configKey';
import {DefinitionList} from './definitionList';
import {Expandable} from './expandable';
import {GuideGrid} from './guideGrid';
import {Include} from './include';
import {IncludePlatformContent} from './includePlatformContent';
import {JsCdnTag} from './jsCdnTag';
import {LambdaLayerDetail} from './lambdaLayerDetail';
import {Note} from './note';
import {PageGrid} from './pageGrid';
import {ParamTable} from './paramTable';
import {PlatformContent} from './platformContent';
import {PlatformIdentifier} from './platformIdentifier';
import {PlatformLink} from './platformLink';
import {PlatformLinkWithLogo} from './platformLinkWithLogo';
import {PlatformSection} from './platformSection';
import {RelayMetrics} from './relayMetrics';
import {SandboxLink, SandboxOnly} from './sandboxLink';
import {SmartLink} from './smartLink';
import {VimeoEmbed, YouTubeEmbed} from './video';

const mdxComponents = {
  Alert,
  a: SmartLink,
  Break,
  CodeBlock,
  CodeTabs,
  ConfigKey,
  Expandable,
  GuideGrid,
  Include,
  IncludePlatformContent,
  JsCdnTag,
  Link: SmartLink,
  Note,
  PageGrid,
  ParamTable,
  DefinitionList,
  PlatformContent,
  PlatformLink,
  PlatformLinkWithLogo,
  PlatformSection,
  PlatformIdentifier,
  RelayMetrics,
  LambdaLayerDetail,
  VimeoEmbed,
  YouTubeEmbed,
  SandboxLink,
  SandboxOnly,
};

export function Markdown({value}) {
  return (
    <MDXProvider components={mdxComponents}>
      <MDXRenderer>{value}</MDXRenderer>
    </MDXProvider>
  );
}
