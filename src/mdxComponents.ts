import {Alert} from './components/alert';
import {Break} from './components/break';
import {CliChecksumTable} from './components/cliChecksumTable';
import {CodeBlock} from './components/codeBlock';
import {CodeTabs} from './components/codeTabs';
import {ConfigKey} from './components/configKey';
import {DefinitionList} from './components/definitionList';
import DocImage from './components/docImage';
import {Expandable} from './components/expandable';
import {GuideGrid} from './components/guideGrid';
import {JsBundleList} from './components/jsBundleList';
import {LambdaLayerDetail} from './components/lambdaLayerDetail';
import {LinkWithPlatformIcon} from './components/linkWithPlatformIcon';
import {Note} from './components/note';
import {OrgAuthTokenNote} from './components/orgAuthTokenNote';
import {PageGrid} from './components/pageGrid';
import {ParamTable} from './components/paramTable';
import {PiiFields} from './components/piiFields';
import {PlatformCategorySection} from './components/platformCategorySection';
import {PlatformGrid} from './components/platformGrid';
import {PlatformIdentifier} from './components/platformIdentifier';
import {PlatformLink} from './components/platformLink';
import {PlatformLinkWithLogo} from './components/platformLinkWithLogo';
import {PlatformOrGuideName} from './components/platformOrGuideName';
import {PlatformSdkPackageName} from './components/platformSdkPackageName';
import {PlatformSection} from './components/platformSection';
import {RelayMetrics} from './components/relayMetrics';
import {SandboxLink} from './components/sandboxLink';
import {SignInNote} from './components/signInNote';
import {SmartLink} from './components/smartLink';
import {VimeoEmbed} from './components/video';

export function mdxComponents(
  dynamicComponents: any = {},
  wrapper: any = ({children}) => children
) {
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
    LinkWithPlatformIcon,
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
    PlatformCategorySection,
    PlatformOrGuideName,
    PlatformSdkPackageName,
    RelayMetrics,
    SandboxLink,
    SignInNote,
    VimeoEmbed,
    a: SmartLink,
    img: DocImage,
    ...dynamicComponents,
    wrapper,
  };
}
