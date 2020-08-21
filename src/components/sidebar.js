import React from "react";
import { StaticQuery, graphql } from "gatsby";

import DynamicNav, { toTree } from "./dynamicNav";
import SidebarLink from "./sidebarLink";

const navQuery = graphql`
  query NavQuery {
    allSitePage(filter: { context: { draft: { ne: false } } }) {
      nodes {
        path
        context {
          draft
          title
          sidebar_order
        }
      }
    }
  }
`;

export default () => {
  return (
    <StaticQuery
      query={navQuery}
      render={data => {
        const tree = toTree(data.allSitePage.nodes.filter(n => !!n.context));
        return (
          <ul className="list-unstyled" data-sidebar-tree>
            <DynamicNav
              root="error-reporting"
              title="Error Monitoring"
              tree={tree}
            />
            <DynamicNav root="platforms" title="Platforms" tree={tree} />
            <DynamicNav
              root="enriching-error-data"
              title="Enriching Error Data"
              tree={tree}
            />
            <DynamicNav root="product" title="Product" tree={tree} />
            <DynamicNav
              root="data-management"
              title="Data Management"
              tree={tree}
            />
            <DynamicNav
              root="accounts"
              title="Account Management"
              tree={tree}
            />
            <DynamicNav root="meta" title="Security and Legal" tree={tree} />
            <DynamicNav
              root="cli"
              title="Command Line Interface"
              tree={tree}
              collapse
            />
            <DynamicNav root="api" title="API Reference" tree={tree} collapse />
            <DynamicNav
              root="clients"
              title="Legacy Clients"
              tree={tree}
              collapse
            />
            <DynamicNav root="support" title="Support" tree={tree} collapse />
            <li className="mb-3" data-sidebar-branch>
              <div
                className="sidebar-title d-flex align-items-center mb-0"
                data-sidebar-link
              >
                <h6>Resources</h6>
              </div>
              <ul className="list-unstyled" data-sidebar-tree>
                <SidebarLink to="https://develop.sentry.dev">
                  Developer Documentation
                </SidebarLink>
                <SidebarLink to="https://github.com/getsentry/onpremise">
                  Self-Hosting Sentry
                </SidebarLink>
              </ul>
            </li>
          </ul>
        );
      }}
    />
  );
};
