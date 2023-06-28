import React from 'react';
import {graphql, StaticQuery} from 'gatsby';

import {DynamicNav, toTree} from './dynamicNav';

const navQuery = graphql`
  query PlatformNavQuery {
    allSitePage(
      filter: {context: {draft: {ne: true}}, path: {regex: "/^/(platforms|product)/"}}
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
  context: {
    platform: {
      name: string;
    };
    title: string;
    sidebar_order?: number;
    sidebar_title?: string;
  };
  path: string;
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

export function SidebarContent({platform, guide, data}: ChildProps): JSX.Element {
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
        prependLinks={[[`/${pathRoot}/`, 'Getting Started']]}
        exclude={[
          `/${pathRoot}/enriching-events/`,
          `/${pathRoot}/data-management/`,
          `/${pathRoot}/performance/`,
          `/${pathRoot}/session-replay/`,
          `/${pathRoot}/profiling/`,
          `/${pathRoot}/guides/`,
          `/${pathRoot}/crons/`,
        ]}
      />
      <DynamicNav
        root={`/${pathRoot}/performance`}
        title="Performance Monitoring"
        prependLinks={[[`/${pathRoot}/performance/`, 'Set Up Performance']]}
        suppressMissing
        tree={tree}
      />
      <DynamicNav
        root={`/${pathRoot}/profiling`}
        title="Profiling"
        prependLinks={[[`/${pathRoot}/profiling/`, 'Set Up Profiling']]}
        suppressMissing
        tree={tree}
      />
      <DynamicNav
        root={`/${pathRoot}/session-replay`}
        title="Session Replay"
        prependLinks={[[`/${pathRoot}/session-replay/`, 'Set Up Session Replay']]}
        suppressMissing
        tree={tree}
      />
      <DynamicNav
        root={`/${pathRoot}/crons`}
        title="Crons"
        prependLinks={[[`/${pathRoot}/crons/`, 'Set Up Crons']]}
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
        root="product"
        title="Product guides"
        tree={tree}
        exclude={[`/product/`]}
      />
      <DynamicNav
        root="platforms"
        title="Other Platforms"
        tree={tree}
        exclude={[`/platforms/${platformName}/`]}
      />
    </ul>
  );
}

export function PlatformSidebar(props: Props): JSX.Element {
  return (
    <StaticQuery
      query={navQuery}
      render={data => <SidebarContent data={data} {...props} />}
    />
  );
}
