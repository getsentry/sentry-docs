import React from 'react';
import {graphql, useStaticQuery} from 'gatsby';

import {DynamicNav, toTree} from './dynamicNav';

const query = graphql`
  query InternalDocsSidebarQuery {
    allSitePage(filter: {path: {regex: "/contributing/"}, context: {draft: {ne: true}}}) {
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

export function InternalDocsSidebar() {
  const data = useStaticQuery(query);
  const tree = toTree(data.allSitePage.nodes.filter(n => !!n.context));
  return (
    <ul className="list-unstyled" data-sidebar-tree>
      <DynamicNav
        root="contributing"
        title="Contributing to Docs"
        tree={tree}
        showDepth={2}
      />
    </ul>
  );
}
