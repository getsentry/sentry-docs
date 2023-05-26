import React, {Fragment} from 'react';
import {useLocation} from '@reach/router';
import {graphql, useStaticQuery} from 'gatsby';

import DynamicNav, {toTree} from './dynamicNav';
import SidebarLink from './sidebarLink';

const query = graphql`
  query ApiNavQuery {
    allSitePage(filter: {path: {regex: "//api//"}}, sort: {fields: path}) {
      nodes {
        path
        context {
          title
        }
      }
    }
  }
`;

export default function ApiSidebar() {
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
        <div className="sidebar-title d-flex align-items-center mb-0" data-sidebar-link>
          <h6>Endpoints</h6>
        </div>
        <ul className="list-unstyled" data-sidebar-tree>
          {endpoints.map(
            ({
              node: {
                path,
                context: {title},
              },
              children,
            }) => (
              <Fragment key={path}>
                <SidebarLink to={path} title={title} />
                {isActive(path) && (
                  <div style={{paddingLeft: '0.5rem'}}>
                    {children
                      .filter(({node}) => !!node)
                      .map(
                        ({
                          node: {
                            path: childPath,
                            context: {title: contextTitle},
                          },
                        }) => (
                          <SidebarLink key={path} to={childPath} title={contextTitle} />
                        )
                      )}
                  </div>
                )}
              </Fragment>
            )
          )}
        </ul>
      </li>
    </ul>
  );
}
