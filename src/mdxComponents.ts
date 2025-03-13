import {Alert} from './components/alert';
import {Arcade} from './components/arcade';
import {Break} from './components/break';
import {Card} from './components/card';
import {CliChecksumTable} from './components/cliChecksumTable';
import {CodeBlock} from './components/codeBlock';
import {CodeTabs} from './components/codeTabs';
import {CommunitySupportedPlatforms} from './components/communitySupportedPlatforms';
import {ConfigKey} from './components/configKey';
import {ConfigValue} from './components/configValue';
import {CreateGitHubAppForm} from './components/createGitHubAppForm';
import {DefinitionList} from './components/definitionList';
import {DevDocsCardGrid} from './components/devDocsCardGrid';
import DocImage from './components/docImage';
import {Expandable} from './components/expandable';
import {GuideGrid} from './components/guideGrid';
import {JsBundleList} from './components/jsBundleList';
import {LambdaLayerDetail} from './components/lambdaLayerDetail';
import {LinkWithPlatformIcon} from './components/linkWithPlatformIcon';
import {OnboardingOption, OnboardingOptionButtons} from './components/onboarding';
import {OrgAuthTokenNote} from './components/orgAuthTokenNote';
import {PageGrid} from './components/pageGrid';
import {ParamTable} from './components/paramTable';
import {PiiFields} from './components/piiFields';
import {PlatformCategorySection} from './components/platformCategorySection';
import {PlatformFilter} from './components/platformFilter';
import {PlatformGrid} from './components/platformGrid';
import {PlatformIdentifier} from './components/platformIdentifier';
import {PlatformLink} from './components/platformLink';
import {PlatformLinkWithLogo} from './components/platformLinkWithLogo';
import {PlatformOrGuideName} from './components/platformOrGuideName';
import {PlatformSdkPackageName} from './components/platformSdkPackageName';
import {PlatformSection} from './components/platformSection';
import {RelayMetrics} from './components/relayMetrics';
import {SandboxLink} from './components/sandboxLink';
import {SdkOption} from './components/sdkOption';
import {SignInNote} from './components/signInNote';
import {SmartLink} from './components/smartLink';
import {TableOfContents} from './components/tableOfContents';
import {VimeoEmbed} from './components/video';

export function mdxComponents(
  dynamicComponents: any = {},
  wrapper: any = ({children}) => children
) {
  return {
    Alert,
    Arcade,
    Break,
    Card,
    CliChecksumTable,
    CommunitySupportedPlatforms,
    DevDocsCardGrid,
    PlatformFilter,
    CodeBlock,
    CodeTabs,
    ConfigKey,
    SdkOption,
    TableOfContents,
    CreateGitHubAppForm,
    ConfigValue,
    DefinitionList,
    Expandable,
    GuideGrid,
    JsBundleList,
    LambdaLayerDetail,
    Link: SmartLink,
    LinkWithPlatformIcon,
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
    OnboardingOption,
    OnboardingOptionButtons,
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
