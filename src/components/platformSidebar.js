import React from "react";
import { StaticQuery, graphql } from "gatsby";

import DynamicNav, { toTree } from "./dynamicNav";
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
          platform {
            name
          }
        }
      }
    }
  }
`;

export default ({ platform, framework }) => {
  const platformName = platform.name;
  const frameworkName = framework ? framework.name : null;

  return (
    <StaticQuery
      query={navQuery}
      render={data => {
        const tree = toTree(
          sortBy(
            data.allSitePage.nodes
              .filter(
                n =>
                  n.context.platform && n.context.platform.name === platformName
              )
              .filter(n => !n.context.draft),
            n => n.path
          )
        );
        return (
          <ul className="list-unstyled" data-sidebar-tree>
            {frameworkName ? (
              <DynamicNav
                root={`platforms/${platformName}/frameworks/${frameworkName}`}
                tree={tree}
                noHeadingLink
                prependLinks={[
                  [
                    `/platforms/${platformName}/frameworks/${frameworkName}/`,
                    "Getting Started",
                  ],
                ]}
              />
            ) : (
              <DynamicNav
                root={`platforms/${platformName}`}
                tree={tree}
                noHeadingLink
                prependLinks={[
                  [`/platforms/${platformName}/`, "Getting Started"],
                ]}
              />
            )}
            <DynamicNav
              root={`/platforms/${platformName}/frameworks`}
              title={frameworkName ? "Other Frameworks" : "Frameworks"}
              prependLinks={
                frameworkName
                  ? [[`/platforms/${platformName}/`, platform.title]]
                  : null
              }
              exclude={
                frameworkName
                  ? [`/platforms/${platformName}/frameworks/${frameworkName}/`]
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
