import {DocNode, nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

import {DynamicNav, toTree} from './dynamicNav';
import {getNavNodes} from './serverSidebar';
import {SidebarLink} from './sidebarLink';

export type NavNode = {
  context: {
    draft: boolean;
    title: string;
    sidebar_order?: number;
    sidebar_title?: string;
  };
  path: string;
};

type ChildProps = {
  rootNode: DocNode;
};

const docNodeToNavNode = (node: DocNode): NavNode => ({
  context: {
    draft: node.frontmatter.draft,
    title: node.frontmatter.title,
    sidebar_order: node.frontmatter.sidebar_order,
    sidebar_title: node.frontmatter.sidebar_title,
  },
  path: '/' + node.path + '/',
});

export function ProductSidebar({rootNode}: ChildProps) {
  const productNode = nodeForPath(rootNode, 'product');
  if (!productNode) {
    return null;
  }
  const nodes: NavNode[] = getNavNodes([productNode], docNodeToNavNode);
  const tree = toTree(nodes.filter(n => !!n.context));
  const {path} = serverContext();
  const fullPath = '/' + path.join('/') + '/';
  return (
    <ul className="list-unstyled" data-sidebar-tree>
      <DynamicNav
        root="product"
        title="Product"
        tree={tree}
        exclude={[
          '/product/integrations/',
          '/product/cli/',
          '/product/security/',
          '/product/accounts/',
          '/product/relay/',
          '/product/data-management-settings/',
        ]}
      />
      <DynamicNav
        root="product/data-management-settings"
        title="Data Management"
        tree={tree}
      />
      <DynamicNav root="product/accounts" title="Account Management" tree={tree} />
      <DynamicNav root="product/relay" title="Relay" tree={tree} />
      <DynamicNav root="product/cli" title="sentry-cli" tree={tree} />
      <DynamicNav root="product/security" title="Security and Legal" tree={tree} />
      <DynamicNav root="product/integrations" title="Integrations" tree={tree} />
      <li className="mb-3" data-sidebar-branch>
        <div className="sidebar-title d-flex align-items-center mb-0" data-sidebar-link>
          <h6>Additional Resources</h6>
        </div>
        <ul className="list-unstyled" data-sidebar-tree>
          <SidebarLink to="https://help.sentry.io/" title="Support" path={fullPath} />
          <SidebarLink to="/platforms/" title="Platforms" path={fullPath} />
          <SidebarLink to="/api/" title="API Reference" path={fullPath} />
          <SidebarLink to="/contributing/" title="Contributing to Docs" path={fullPath} />
          <SidebarLink
            to="https://develop.sentry.dev"
            title="Developer Documentation"
            path={fullPath}
          />
          <SidebarLink
            to="https://develop.sentry.dev/self-hosted/"
            title="Self-Hosting Sentry"
            path={fullPath}
          />
        </ul>
      </li>
      {process.env.NODE_ENV !== 'production' && (
        <DynamicNav root="_debug" title="Debug (Dev Only)" tree={tree} />
      )}
    </ul>
  );
}
