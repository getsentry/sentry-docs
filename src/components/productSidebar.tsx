import {serverContext} from 'sentry-docs/serverContext';

import {DynamicNav, toTree} from './dynamicNav';
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
  data: {
    allSitePage: {
      nodes: NavNode[];
    };
  };
};

export function ProductSidebar({data}: ChildProps) {
  const tree = toTree(data.allSitePage.nodes.filter(n => !!n.context));
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
          <SidebarLink to="https://sentry.zendesk.com/hc/en-us/" title="Support" path={fullPath} />
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
