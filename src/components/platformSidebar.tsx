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
          sidebar_title
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
    sidebar_order?: number;
    sidebar_title?: string;
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
        prependLinks={[[`/${pathRoot}/`, "Getting Started"]]}
        exclude={[
          `/${pathRoot}/enriching-events/`,
          `/${pathRoot}/data-management/`,
          `/${pathRoot}/performance/`,
          `/${pathRoot}/guides/`,
        ]}
      />
      <DynamicNav
        root={`/${pathRoot}/performance`}
        title="Performance Monitoring"
        prependLinks={[[`/${pathRoot}/performance/`, "Getting Started"]]}
        suppressMissing
        tree={tree}
      />
      <DynamicNav
        root={`/${pathRoot}/enriching-events`}
        title="Enriching Events"
        tree={tree}
      />
      <DynamicNav
        root={`/${pathRoot}/data-management`}
        title="Data Management"
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
        suppressMissing
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
