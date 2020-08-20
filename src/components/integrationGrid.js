import React from "react";
import { StaticQuery, graphql } from "gatsby";

import SmartLink from "./smartLink";
import { sortBy } from "../utils";

const query = graphql`
  query FrameworkQuery {
    allSitePage(
      filter: {
        path: { regex: "//integration/[^/]+/$/" }
        context: { integration: { name: { ne: null } } }
      }
    ) {
      nodes {
        id
        path
        context {
          platform {
            name
          }
          integration {
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
          n => n.context.integration.title
        );
        return (
          <ul>
            {matches.map(n => (
              <li key={n.context.integration.name}>
                <SmartLink to={n.path}>{n.context.integration.title}</SmartLink>
              </li>
            ))}
          </ul>
        );
      }}
    />
  );
};
