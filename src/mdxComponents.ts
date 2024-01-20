import {MDXComponents} from 'mdx/types';
import {Alert} from './components/alert';
import {Break} from './components/break';
import {CliChecksumTable} from './components/cliChecksumTable';
import {ConfigKey} from './components/configKey';
import {DefinitionList} from './components/definitionList';
import {Expandable} from './components/expandable';
import {GuideGrid} from './components/guideGrid';
import {JsBundleList} from './components/jsBundleList';
import {LambdaLayerDetail} from './components/lambdaLayerDetail';
import {Note} from './components/note';
import {OrgAuthTokenNote} from './components/orgAuthTokenNote';
import {PageGrid} from './components/pageGrid';
import {ParamTable} from './components/paramTable';
import {PiiFields} from './components/piiFields';
import {PlatformGrid} from './components/platformGrid';
import {PlatformIdentifier} from './components/platformIdentifier';
import {PlatformLink} from './components/platformLink';
import {PlatformLinkWithLogo} from './components/platformLinkWithLogo';
import {PlatformSection} from './components/platformSection';
import {RelayMetrics} from './components/relayMetrics';
import {SandboxLink} from './components/sandboxLink';
import {SignInNote} from './components/signInNote';
import {SmartLink} from './components/smartLink';
import {VimeoEmbed} from './components/video';
import {CodeBlock} from './components/codeBlock';
import {CodeTabs} from './components/codeTabs';
import DocImage from './components/docImage';

export function mdxComponents(
  dynamicComponents: any = {},
  wrapper: any = ({children}) => children
): MDXComponents {
  return {
    Alert,
    Break,
    CliChecksumTable,
    CodeBlock,
    CodeTabs,
    ConfigKey,
    DefinitionList,
    Expandable,
    GuideGrid,
    JsBundleList,
    LambdaLayerDetail,
    Link: SmartLink,
    Note,
    OrgAuthTokenNote,
    PageGrid,
    ParamTable,
    PiiFields,
    PlatformGrid,
    PlatformIdentifier,
    PlatformLink,
    PlatformLinkWithLogo,
    PlatformSection,
    RelayMetrics,
    SandboxLink,
    SignInNote,
    VimeoEmbed,
    a: SmartLink,
    img: DocImage,
    ...dynamicComponents,
    wrapper: wrapper,
  };
}
