import {nodeForPath} from 'sentry-docs/docTree';

import {DynamicNav, toTree} from './dynamicNav';
import {SidebarLink, SidebarSeparator} from './sidebarLink';
import {NavNode, ProductSidebarProps} from './types';
import {docNodeToNavNode, getNavNodes} from './utils';

export function ProductSidebar({rootNode, items}: ProductSidebarProps) {
  const itemTree = (item: string) => {
    const node = nodeForPath(rootNode, item);
    if (!node) {
      return null;
    }
    const nodes: NavNode[] = getNavNodes([node], docNodeToNavNode);
    return toTree(nodes.filter(n => !!n.context));
  };
  return (
    <div>
      <ul data-sidebar-tree>
        {items.map(item => {
          const tree = itemTree(item.root);

          return (
            tree && (
              <DynamicNav
                key={item.root}
                root={item.root}
                title={item.title}
                tree={tree}
                collapsible
              />
            )
          );
        })}
      </ul>
      <SidebarSeparator />
      <ul data-sidebar-tree>
        <li className="mb-3" data-sidebar-branch>
          <ul data-sidebar-tree>
            <SidebarLink href="https://about.codecov.io/" title="Codecov" />
            <SidebarLink href="https://discord.gg/sentry" title="Discord" />
            <SidebarLink href="https://sentry.zendesk.com/hc/en-us/" title="Support" />
            <SidebarLink
              href="https://develop.sentry.dev/self-hosted/"
              title="Self-Hosting Sentry"
            />
            <SidebarLink
              href="https://develop.sentry.dev"
              title="Developer Documentation"
            />
          </ul>
        </li>
      </ul>
    </div>
  );
}
