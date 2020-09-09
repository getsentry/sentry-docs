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

const getTitle = node => {
  // TODO(dcramer): support frontmatter somehow from js files
  if (node.path === "/") return "Home";
  return node.context.title;
};

export const Breadcrumbs = ({
  data: {
    allSitePage: { nodes },
  },
}: Props) => {
  const location = useLocation();
  let currentPath = location.pathname;
  if (currentPath.substr(currentPath.length - 1) !== "/")
    currentPath = currentPath += "/";
  const rootNode = nodes.find(n => n.path === currentPath);
  if (!rootNode) {
    console.warn(`Cant find root node for breadcrumbs: ${currentPath}`);
    return null;
  }
  const trailNodes = nodes.filter(n => rootNode.path.indexOf(n.path) === 0);

  return (
    <ul className="breadcrumb" style={{ margin: 0 }}>
      {trailNodes
        .sort((a, b) => a.path.localeCompare(b.path))
        .map(n => {
          const title = getTitle(n);
          if (!title) return null;
          return (
            <li className="breadcrumb-item" key={n.id}>
              <SmartLink to={n.path}>{title}</SmartLink>
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
