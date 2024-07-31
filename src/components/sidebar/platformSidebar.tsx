import {DocNode, getGuide, getPlatform, nodeForPath} from 'sentry-docs/docTree';

import {DynamicNav, toTree} from '../dynamicNav';

import {PlatformSidebarProps} from './types';
import {getNavNodes} from './utils';

export function PlatformSidebar({
  rootNode,
  platformName,
  guideName,
  headerClassName,
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
  const tree = toTree(nodes.filter(n => !!n.context));
  const guide = guideName && getGuide(rootNode, platformName, guideName);

  const pathRoot = guide
    ? `platforms/${platformName}/guides/${guideName}`
    : `platforms/${platformName}`;

  return (
    <ul data-sidebar-tree>
      <DynamicNav
        root={pathRoot}
        tree={tree}
        title={`Sentry for ${(guide || platform).title}`}
        exclude={[`/${pathRoot}/guides/`]}
        headerClassName={headerClassName}
        withChevron
      />
    </ul>
  );
}
