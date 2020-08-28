import React from "react";
import { StaticQuery, graphql } from "gatsby";

import DynamicNav, { toTree } from "./dynamicNav";

const navQuery = graphql`
  query PlatformNavQuery {
    allSitePage(
      filter: {
        context: { draft: { ne: false } }
        path: { regex: "/^/platforms/" }
      }
    ) {
      nodes {
        path
        context {
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
    siebar_order?: number;
    platform: {
      name: string;
    };
  };
};

type Props = {
  platform: {
    name: string;
    title: string;
  };
  guide?: {
    name: string;
    title: string;
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
  const pathRoot = guideName
    ? `platforms/${platformName}/guides/${guideName}`
    : `platforms/${platformName}`;
  return (
    <ul className="list-unstyled" data-sidebar-tree>
      <DynamicNav
        root={pathRoot}
        tree={tree}
        title={`Sentry for ${(guide || platform).title}`}
        showDepth={1}
        prependLinks={[[`/${pathRoot}/`, "Getting Started"]]}
      />
      <DynamicNav
        root={`/${pathRoot}/enriching-error-data`}
        title="Enriching Error Data"
        showDepth={1}
        tree={tree}
      />
      <DynamicNav
        root={`/${pathRoot}/data-management`}
        title="Data Management"
        showDepth={1}
        tree={tree}
      />
      <DynamicNav
        root={`/platforms/${platformName}/guides`}
        title="Other Guides"
        prependLinks={
          guideName ? [[`/platforms/${platformName}/`, platform.title]] : null
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
