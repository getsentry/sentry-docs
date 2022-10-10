import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { useLocation } from "@reach/router";

import SmartLink from "./smartLink";
import { sortPages } from "~src/utils";

const query = graphql`
  query PageGridQuery {
    allSitePage {
      nodes {
        path
        context {
          description
          title
          sidebar_order
        }
      }
    }
  }
`;

type PageLink = {
  title: string;
  path: string;
  description?: string;
};

type Props = {
  nextPages: boolean;
  header?: string;

  /** Adds list items of page links that are not automatically found by the PageGrid component */
  additionalPages?: PageLink[];
};

export default ({
  nextPages = false,
  header,
  additionalPages,
}: Props): JSX.Element => {
  const data = useStaticQuery(query);
  const location = useLocation();

  const currentPath = location.pathname;
  const currentPathLen = currentPath.length;

  let matches = sortPages(
    data.allSitePage.nodes.filter(
      n =>
        n.context &&
        n.context.title &&
        n.path.indexOf(currentPath) === 0 &&
        n.path.slice(currentPathLen).split("/", 2)[1] === ""
    )
  );

  if (nextPages) {
    const currentPage = matches.find(n => n.path === currentPath);
    if (currentPage) {
      matches = matches.slice(matches.indexOf(currentPage));
    }
  } else {
    matches = matches.filter(n => n.path !== currentPath);
  }

  if (!matches.length) return null;

  const addedPages =
    (additionalPages &&
      additionalPages.map(p => ({
        path: p.path,
        context: { title: p.title, description: p.description },
      }))) ||
    [];

  const items = [...matches, ...addedPages];

  return (
    <nav>
      {header && <h2>{header}</h2>}
      <ul>
        {items.map(n => (
          <li key={n.path} style={{ marginBottom: "1rem" }}>
            <h4 style={{ marginBottom: 0 }}>
              <SmartLink to={n.path}>{n.context.title}</SmartLink>
            </h4>
            {n.context.description ?? <p>{n.context.description}</p>}
          </li>
        ))}
      </ul>
    </nav>
  );
};
