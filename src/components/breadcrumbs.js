import React from "react";
import { useLocation } from "@reach/router";
import { StaticQuery, graphql } from "gatsby";
import SmartLink from "./smartLink";

const query = graphql`
  query BreadcrumbsQuery {
    allSitePage {
      nodes {
        id
        path
        context {
          title
        }
      }
    }
  }
`;

export default () => {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <StaticQuery
      query={query}
      render={({ allSitePage: { nodes } }) => {
        let rootNode = nodes.find(n => n.path === currentPath);
        if (!rootNode) {
          throw new Error(
            `Cant find root node for breadcrumbs: ${currentPath}`
          );
        }
        let trailNodes = nodes.filter(n => rootNode.path.indexOf(n.path) === 0);
        return (
          <ul className="breadcrumb" style={{ marginBottom: "1rem" }}>
            {trailNodes
              .sort((a, b) => a.path.localeCompare(b.path))
              .map(n => {
                return (
                  <li className="breadcrumb-item" key={n.id}>
                    <SmartLink to={n.path}>{n.context.title}</SmartLink>
                  </li>
                );
              })}
          </ul>
        );
      }}
    />
  );
};
