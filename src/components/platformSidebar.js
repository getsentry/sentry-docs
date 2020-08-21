import React from "react";
import { StaticQuery, graphql } from "gatsby";

import DynamicNav, { toTree } from "./dynamicNav";

const navQuery = graphql`
  query PlatformNavQuery {
    allSitePage(filter: { context: { draft: { ne: false } } }) {
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

export default ({ platform, guide }) => {
  const platformName = platform.name;
  const guideName = guide ? guide.name : null;

  return (
    <StaticQuery
      query={navQuery}
      render={data => {
        const tree = toTree(data.allSitePage.nodes.filter(n => !!n.context));
        return (
          <ul className="list-unstyled" data-sidebar-tree>
            {guideName ? (
              <DynamicNav
                root={`platforms/${platformName}/guides/${guideName}`}
                tree={tree}
                noHeadingLink
                prependLinks={[
                  [
                    `/platforms/${platformName}/guides/${guideName}/`,
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
              root={`/platforms/${platformName}/guides`}
              title={guideName ? "Other Guides" : "Guides"}
              prependLinks={
                guideName
                  ? [[`/platforms/${platformName}/`, platform.title]]
                  : null
              }
              exclude={
                guideName
                  ? [`/platforms/${platformName}/guides/${guideName}/`]
                  : []
              }
              tree={tree}
            />
            <DynamicNav
              root="platforms"
              title="Other Platforms"
              tree={tree}
              exclude={[`/platforms/${platformName}/`]}
            />
          </ul>
        );
      }}
    />
  );
};
