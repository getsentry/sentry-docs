import {nodeForPath} from 'sentry-docs/docTree';

import {DynamicNav, toTree} from './dynamicNav';
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
                collapsible={false}
              />
            )
          );
        })}
      </ul>
      {/* External links menu removed from here */}
    </div>
  );
}
