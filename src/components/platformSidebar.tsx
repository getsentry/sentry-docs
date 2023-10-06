import React from 'react';
import {graphql, useStaticQuery} from 'gatsby';

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

export function SidebarContent({platform, guide, data}: ChildProps) {
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
          `/${pathRoot}/error-monitoring/`,
          `/${pathRoot}/performance/`,
          `/${pathRoot}/session-replay/`,
          `/${pathRoot}/profiling/`,
          `/${pathRoot}/guides/`,
          `/${pathRoot}/crons/`,
        ]}
      />
      <DynamicNav
        root={`/${pathRoot}/error-monitoring`}
        title="Error Monitoring"
        prependLinks={[[`/${pathRoot}/error-monitoring/`, 'Getting Started']]}
        suppressMissing
        tree={tree}
      />
      <DynamicNav
        root={`/${pathRoot}/performance`}
        title="Performance Monitoring"
        prependLinks={[[`/${pathRoot}/performance/`, 'Getting Started']]}
        suppressMissing
        tree={tree}
      />
      <DynamicNav
        root={`/${pathRoot}/profiling`}
        title="Profiling"
        prependLinks={[[`/${pathRoot}/profiling/`, 'Getting Started']]}
        suppressMissing
        tree={tree}
      />
      <DynamicNav
        root={`/${pathRoot}/session-replay`}
        title="Session Replay"
        prependLinks={[[`/${pathRoot}/session-replay/`, 'Getting Started']]}
        suppressMissing
        tree={tree}
      />
      <DynamicNav
        root={`/${pathRoot}/crons`}
        title="Cron Monitoring"
        prependLinks={[[`/${pathRoot}/crons/`, 'Getting Started']]}
        suppressMissing
        tree={tree}
      />
    </ul>
  );
}

export function PlatformSidebar(props: Props) {
  const data = useStaticQuery(navQuery);

  return <SidebarContent data={data} {...props} />;
}
