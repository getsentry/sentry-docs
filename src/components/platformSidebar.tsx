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

type Node = {
  path: string;
  context: {
    title: string;
    draft?: boolean;
    siebar_order?: number;
    platform: {
      name: string;
    };
  };
};

type Props = {
  platform: {
    name: string;
  };
  guide?: {
    name: string;
  };
};

type ChildProps = Props & {
  data: {
    allSitePage: {
      nodes: Node[];
    };
  };
};

export const PlatformSidebar = ({
  platform,
  guide,
  data,
}: ChildProps): JSX.Element => {
  const platformName = platform.name;
  const guideName = guide ? guide.name : null;
  const tree = toTree(data.allSitePage.nodes.filter(n => !!n.context));
  return (
    <ul className="list-unstyled" data-sidebar-tree>
      {guideName ? (
        <DynamicNav
          root={`platforms/${platformName}/guides/${guideName}`}
          tree={tree}
          noHeadingLink
          showDepth={1}
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
          showDepth={1}
          prependLinks={[[`/platforms/${platformName}/`, "Getting Started"]]}
        />
      )}
      <DynamicNav
        root={`/platforms/${platformName}/guides`}
        title={guideName ? "Other Guides" : "Guides"}
        prependLinks={
          guideName ? [[`/platforms/${platformName}/`, platform.name]] : null
        }
        exclude={
          guideName ? [`/platforms/${platformName}/guides/${guideName}/`] : []
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
};

export default (props: Props): JSX.Element => {
  return (
    <StaticQuery
      query={navQuery}
      render={data => <PlatformSidebar data={data} {...props} />}
    />
  );
};
