import React from "react";
import { StaticQuery, graphql } from "gatsby";

import SmartLink from "./smartLink";
import { sortBy } from "../utils";

const query = graphql`
  query PlatformGuideQuery {
    allSitePage(
      filter: {
        path: { regex: "//guides/[^/]+/$/" }
        context: { guide: { name: { ne: null } } }
      }
    ) {
      nodes {
        id
        path
        context {
          platform {
            name
          }
          guide {
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
          n => n.context.guide.title
        );
        return (
          <ul>
            {matches.map(n => (
              <li key={n.context.guide.name}>
                <SmartLink to={n.path}>{n.context.guide.title}</SmartLink>
              </li>
            ))}
          </ul>
        );
      }}
    />
  );
};
