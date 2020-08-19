import React from "react";
import { StaticQuery, graphql } from "gatsby";

import DynamicNav, { toTree } from "./dynamicNav";
import SmartLink from "./smartLink";
import { sortBy } from "~src/utils";

const navQuery = graphql`
  query PlatformNavQuery {
    allSitePage(filter: { path: { regex: "/^/platforms//" } }) {
      nodes {
        path
        context {
          draft
          title
          sidebar_order
          platformName
        }
      }
    }
  }
`;

export default ({ platform, integration }) => {
  const platformName = platform.name;
  const integrationName = integration ? integration.name : null;

  return (
    <StaticQuery
      query={navQuery}
      render={data => {
        const tree = toTree(
          sortBy(
            data.allSitePage.nodes
              .filter(n => n.context.platform.name === platformName)
              .filter(n => !n.context.draft),
            n => n.path
          )
        );
        return (
          <ul className="list-unstyled" data-sidebar-tree>
            {integrationName ? (
              <DynamicNav
                root={`platforms/${platformName}/integrations/${integrationName}`}
                tree={tree}
              />
            ) : (
              <DynamicNav root={`platforms/${platformName}`} tree={tree} />
            )}
            <DynamicNav
              root={`/platforms/${platformName}/integrations`}
              title={integrationName ? "Other Integrations" : "Integrations"}
              prependChildren={
                integrationName
                  ? [
                      <SmartLink to={`/platforms/${platformName}/`}>
                        {platform.title}
                      </SmartLink>,
                    ]
                  : null
              }
              exclude={
                integrationName
                  ? [
                      `/platforms/${platformName}/integrations/${integrationName}/`,
                    ]
                  : []
              }
              tree={tree}
            />
          </ul>
        );
      }}
    />
  );
};
