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

type Node = {
  id: string;
  path: string;
  context: {
    title: string;
  };
};

type Props = {
  data: {
    allSitePage: {
      nodes: Node[];
    };
  };
};

export const Breadcrumbs = ({
  data: {
    allSitePage: { nodes },
  },
}: Props) => {
  const location = useLocation();
  const currentPath = location.pathname;
  let rootNode = nodes.find(n => n.path === currentPath);
  if (!rootNode) {
    console.warn(`Cant find root node for breadcrumbs: ${currentPath}`);
    return null;
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
};

export default () => {
  return (
    <StaticQuery
      query={query}
      render={data => {
        return <Breadcrumbs data={data} />;
      }}
    />
  );
};
