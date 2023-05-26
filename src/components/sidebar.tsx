import React from 'react';
import {graphql, StaticQuery} from 'gatsby';

import DynamicNav, {toTree} from './dynamicNav';
import SidebarLink from './sidebarLink';

const navQuery = graphql`
  query NavQuery {
    allSitePage(filter: {context: {draft: {ne: true}}}) {
      nodes {
        path
        context {
          draft
          title
          sidebar_order
          sidebar_title
        }
      }
    }
  }
`;

type NavNode = {
  context: {
    draft: boolean;
    sidebar_order: number;
    title: string;
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

export function BaseSidebar({data}: ChildProps): JSX.Element {
  const tree = toTree(data.allSitePage.nodes.filter(n => !!n.context));
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
          <SidebarLink to="https://help.sentry.io/">Support</SidebarLink>
          <SidebarLink to="/platforms/">Platforms</SidebarLink>
          <SidebarLink to="/api/">API Reference</SidebarLink>
          <SidebarLink to="/contributing/">Contributing to Docs</SidebarLink>
          <SidebarLink to="https://develop.sentry.dev">
            Developer Documentation
          </SidebarLink>
          <SidebarLink to="https://develop.sentry.dev/self-hosted/">
            Self-Hosting Sentry
          </SidebarLink>
        </ul>
      </li>
      {process.env.NODE_ENV !== 'production' && (
        <DynamicNav root="_debug" title="Debug (Dev Only)" tree={tree} />
      )}
    </ul>
  );
}

export default function Sidebar() {
  return <StaticQuery query={navQuery} render={data => <BaseSidebar data={data} />} />;
}
