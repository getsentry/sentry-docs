import {DocNode, getGuide, getPlatform, nodeForPath} from 'sentry-docs/docTree';

import {DynamicNav, toTree} from './dynamicNav';
import {PlatformSidebarProps} from './types';
import {getNavNodes} from './utils';

// AI library pages that live under agent-tracing but are also integrations.
const AI_INTEGRATION_SLUGS = [
  'anthropic',
  'google-genai',
  'langchain',
  'langgraph',
  'mastra',
  'openai',
  'vercelai',
];

export function PlatformSidebar({
  rootNode,
  platformName,
  guideName,
}: PlatformSidebarProps) {
  const docNodeToPlatformSidebarNode = (n: DocNode) => {
    if (n.frontmatter.draft) {
      return undefined;
    }
    return {
      context: {
        platform: {
          platformName,
        },
        title: n.frontmatter.title,
        sidebar_order: n.frontmatter.sidebar_order,
        sidebar_title: n.frontmatter.sidebar_title,
        sidebar_hidden: n.frontmatter.sidebar_hidden,
        beta: n.frontmatter.beta,
        new: n.frontmatter.new,
        early_access: n.frontmatter.early_access,
        section_end_divider: n.frontmatter.section_end_divider,
        sidebar_section: n.frontmatter.sidebar_section,
      },
      path: '/' + n.path + '/',
    };
  };

  const platformNode = nodeForPath(rootNode, ['platforms', platformName]);
  if (!platformNode) {
    return null;
  }
  const platform = getPlatform(rootNode, platformName);
  if (!platform) {
    return null;
  }
  const nodes = getNavNodes([platformNode], docNodeToPlatformSidebarNode);
  const guide = guideName && getGuide(rootNode, platformName, guideName);

  const pathRoot = guide
    ? `platforms/${platformName}/guides/${guideName}`
    : `platforms/${platformName}`;

  // The AI library pages live under agent-tracing, but they're also integrations,
  // so mirror them into the integrations list. These are link-only entries: they
  // sit under configuration/integrations but point at the real agent-tracing page.
  const aiIntegrationAliases = AI_INTEGRATION_SLUGS.map(slug => {
    const target = nodeForPath(rootNode, [...pathRoot.split('/'), 'agent-tracing', slug]);
    // Not every library is supported on every platform - skip where there's no page.
    if (!target || target.missing || target.frontmatter.draft) {
      return undefined;
    }
    return {
      context: {
        platform: {platformName},
        title: target.frontmatter.title,
        sidebar_title: target.frontmatter.sidebar_title,
        // Deliberately no sidebar_order: these sort alphabetically among the
        // other integrations rather than carrying their agent-tracing ordering.
        href: '/' + target.path + '/',
      },
      path: `/${pathRoot}/configuration/integrations/${slug}/`,
    };
  }).filter(n => n !== undefined);

  const tree = toTree([...nodes, ...aiIntegrationAliases].filter(n => !!n.context));

  // Use "Getting Started" for Next.js, default title for other platforms
  const isNextJs = platformName === 'javascript' && guideName === 'nextjs';
  const sidebarTitle = isNextJs
    ? 'Getting Started'
    : `Sentry for ${(guide || platform).title}`;

  return (
    <ul data-sidebar-tree>
      <DynamicNav
        root={pathRoot}
        tree={tree}
        title={sidebarTitle}
        exclude={[`/${pathRoot}/guides/`]}
      />
    </ul>
  );
}
