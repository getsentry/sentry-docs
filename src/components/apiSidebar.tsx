import React from "react";
import { graphql, useStaticQuery } from "gatsby";

import SidebarLink from "./sidebarLink";
import DynamicNav, { toTree } from "./dynamicNav";

const query = graphql`
  query ApiNavQuery {
    allSitePage(
      filter: { path: { regex: "//api//" }, context: { draft: { ne: false } } }
    ) {
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
  const data = useStaticQuery(query);
  const tree = toTree(data.allSitePage.nodes.filter(n => !!n.context));
  return (
    <ul className="list-unstyled" data-sidebar-tree>
      <DynamicNav
        root="api"
        title="API Reference"
        tree={tree}
        exclude={[
          "/api/events/",
          "/api/releases/",
          "/api/projects/",
          "/api/teams/",
          "/api/organizations/",
        ]}
      />
      <li className="mb-3" data-sidebar-branch>
        <div
          className="sidebar-title d-flex align-items-center mb-0"
          data-sidebar-link
        >
          <h6>Endpoints</h6>
        </div>
        <ul className="list-unstyled" data-sidebar-tree>
          <SidebarLink to="/api/events/">Events &amp; Issues</SidebarLink>
          <SidebarLink to="/api/releases/">Releases</SidebarLink>
          <SidebarLink to="/api/projects/">Projects</SidebarLink>
          <SidebarLink to="/api/teams/">Teams</SidebarLink>
          <SidebarLink to="/api/organizations/">Organizations</SidebarLink>
        </ul>
      </li>
    </ul>
  );
};
