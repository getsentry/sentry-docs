import {nodeForPath} from 'sentry-docs/docTree';

import {DynamicNav, toTree} from '../dynamicNav';
import {SidebarLink} from '../sidebarLink';

import {NavNode, ProductSidebarProps} from './types';
import {docNodeToNavNode, getNavNodes} from './utils';

export function ProductSidebar({rootNode, items, headerClassName}: ProductSidebarProps) {
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
                headerClassName={headerClassName}
                collapse
                withChevron
              />
            )
          );
        })}
      </ul>
      <hr />
      <ul data-sidebar-tree>
        <li className="mb-3" data-sidebar-branch>
          <ul data-sidebar-tree>
            <SidebarLink to="https://about.codecov.io/" title="Codecov" path="" />
            <SidebarLink to="https://discord.gg/sentry" title="Discord" path="" />
            <SidebarLink
              to="https://sentry.zendesk.com/hc/en-us/"
              title="Support"
              path=""
            />
            <SidebarLink
              to="https://develop.sentry.dev/self-hosted/"
              title="Self-Hosting Sentry"
              path=""
            />
            <SidebarLink
              to="https://develop.sentry.dev"
              title="Developer Documentation"
              path=""
            />
          </ul>
        </li>
      </ul>
    </div>
  );
}
