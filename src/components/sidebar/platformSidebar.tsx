import {DocNode, getGuide, getPlatform, nodeForPath} from 'sentry-docs/docTree';

import {DynamicNav, toTree} from './dynamicNav';
import {PlatformSidebarProps} from './types';
import {getNavNodes} from './utils';

/**
 * Platforms whose AI pages live under agent-tracing, mapped to where those pages
 * are mirrored in the sidebar by default.
 */
const INTEGRATIONS_PATH_BY_PLATFORM: Record<string, string> = {
  javascript: 'configuration/integrations',
  python: 'integrations',
};

const AGENT_TRACING_ALIAS_PATH_OVERRIDES: Record<string, Record<string, string>> = {
  'javascript.cloudflare': {
    'agents-sdk': 'features',
    'workers-ai': 'features',
  },
};

const UNALIASED_AGENT_TRACING_PAGES = new Set(['manual-instrumentation']);
const CLOUDFLARE_AGENT_TRACING_PAGE_SLUGS = ['agents-sdk', 'workers-ai'];

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

  // Mirror Agent Tracing pages elsewhere in the sidebar as link-only entries.
  // Most are integrations; guide-specific overrides can place pages in a more
  // appropriate section while keeping Agent Tracing as their canonical location.
  const integrationsPath = INTEGRATIONS_PATH_BY_PLATFORM[platformName];
  const aliasPathOverrides = guideName
    ? AGENT_TRACING_ALIAS_PATH_OVERRIDES[`${platformName}.${guideName}`]
    : undefined;
  const agentTracingNode =
    integrationsPath && nodeForPath(rootNode, [...pathRoot.split('/'), 'agent-tracing']);

  const agentTracingAliases = !agentTracingNode
    ? []
    : agentTracingNode.children
        .filter(
          child =>
            !child.missing &&
            !child.frontmatter.draft &&
            !UNALIASED_AGENT_TRACING_PAGES.has(child.slug)
        )
        .map(child => ({
          context: {
            platform: {platformName},
            title: child.frontmatter.title,
            sidebar_title: child.frontmatter.sidebar_title,
            // Deliberately no sidebar_order: aliases sort alphabetically in their
            // secondary location instead of using their Agent Tracing order.
            href: '/' + child.path + '/',
          },
          path: `/${pathRoot}/${aliasPathOverrides?.[child.slug] ?? integrationsPath}/${child.slug}/`,
        }));

  // Expose Cloudflare-only pages from every JavaScript Agent Tracing sidebar.
  // Their links navigate to the canonical Cloudflare guide instead of creating
  // unsupported copies under the current guide.
  const cloudflareAgentTracingAliases =
    platformName !== 'javascript' || guideName === 'cloudflare' || !agentTracingNode
      ? []
      : CLOUDFLARE_AGENT_TRACING_PAGE_SLUGS.map(slug => {
          const target = nodeForPath(rootNode, [
            'platforms',
            'javascript',
            'guides',
            'cloudflare',
            'agent-tracing',
            slug,
          ]);
          if (!target || target.missing || target.frontmatter.draft) {
            return undefined;
          }
          return {
            context: {
              platform: {platformName},
              title: target.frontmatter.title,
              sidebar_title: target.frontmatter.sidebar_title,
              href: '/' + target.path + '/',
            },
            path: `/${pathRoot}/agent-tracing/${slug}/`,
          };
        }).filter(alias => alias !== undefined);

  const tree = toTree(
    [...nodes, ...agentTracingAliases, ...cloudflareAgentTracingAliases].filter(
      n => !!n.context
    )
  );

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
