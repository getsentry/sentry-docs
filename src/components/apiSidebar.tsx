import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { useLocation } from "@reach/router";

import SidebarLink from "./sidebarLink";
import DynamicNav, { toTree } from "./dynamicNav";

const query = graphql`
  query ApiNavQuery {
    allSitePage(
      filter: { path: { regex: "//api//" } }
      sort: { fields: path }
    ) {
      nodes {
        path
        context {
          title
        }
      }
    }
  }
`;

export default () => {
  const data = useStaticQuery(query);
  const tree = toTree(data.allSitePage.nodes.filter(n => !!n.context));
  const endpoints = tree[0].children.filter(curr => curr.children.length > 1);
  const location = useLocation();

  const isActive = path => location && location.pathname.startsWith(path);

  return (
    <ul className="list-unstyled" data-sidebar-tree>
      <DynamicNav
        root="api"
        title="API Reference"
        tree={tree}
        exclude={endpoints.map(elem => elem.node.path)}
      />
      <li className="mb-3" data-sidebar-branch>
        <div
          className="sidebar-title d-flex align-items-center mb-0"
          data-sidebar-link
        >
          <h6>Endpoints</h6>
        </div>
        <ul className="list-unstyled" data-sidebar-tree>
          {endpoints.map(({ node: { path, context: { title } }, children }) => (
            <React.Fragment key={path}>
              <SidebarLink to={path}>{title}</SidebarLink>
              {isActive(path) && (
                <div style={{ paddingLeft: "0.5rem" }}>
                  {children
                    .filter(({ node }) => !!node)
                    .map(({ node: { path, context: { title } } }) => (
                      <SidebarLink key={path} to={path}>
                        {title}
                      </SidebarLink>
                    ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </ul>
      </li>
    </ul>
  );
};
