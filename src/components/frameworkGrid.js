import React from "react";
import { StaticQuery, graphql } from "gatsby";

import SmartLink from "./smartLink";
import { sortBy } from "../utils";

const query = graphql`
  query FrameworkQuery {
    allSitePage(
      filter: {
        path: { regex: "//frameworks/[^/]+/$/" }
        context: { framework: { name: { ne: null } } }
      }
    ) {
      nodes {
        id
        path
        context {
          platform {
            name
          }
          framework {
            name
            title
          }
        }
      }
    }
  }
`;

export default ({ platform }) => {
  return (
    <StaticQuery
      query={query}
      render={({ allSitePage: { nodes } }) => {
        let matches = sortBy(
          nodes.filter(n => n.context.platform.name === platform),
          n => n.context.framework.title
        );
        return (
          <ul>
            {matches.map(n => (
              <li key={n.context.framework.name}>
                <SmartLink to={n.path}>{n.context.framework.title}</SmartLink>
              </li>
            ))}
          </ul>
        );
      }}
    />
  );
};
