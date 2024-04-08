import {DynamicNav, toTree} from './dynamicNav';

export type Node = {
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
  nodes: Node[];
};

export function PlatformSidebar({platform, guide, nodes}: ChildProps) {
  const platformName = platform.name;
  const guideName = guide ? guide.name : null;
  const tree = toTree(nodes.filter(n => !!n.context));
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
          `/${pathRoot}/distributed-tracing/`,
          `/${pathRoot}/performance/`,
          `/${pathRoot}/metrics/`,
          `/${pathRoot}/session-replay/`,
          `/${pathRoot}/profiling/`,
          `/${pathRoot}/guides/`,
          `/${pathRoot}/crons/`,
          `/${pathRoot}/user-feedback/`,
        ]}
      />
      <DynamicNav
        root={`/${pathRoot}/distributed-tracing`}
        title="Distributed Tracing"
        prependLinks={[
          [`/${pathRoot}/distributed-tracing/`, 'Set Up Distributed Tracing'],
        ]}
        suppressMissing
        tree={tree}
      />
      <DynamicNav
        root={`/${pathRoot}/performance`}
        title="Performance Monitoring"
        prependLinks={[[`/${pathRoot}/performance/`, 'Set Up Performance']]}
        suppressMissing
        tree={tree}
      />
      <DynamicNav
        root={`/${pathRoot}/metrics`}
        title="Metrics"
        prependLinks={[[`/${pathRoot}/metrics/`, 'Set Up Metrics']]}
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
        root={`/${pathRoot}/user-feedback`}
        title="User Feedback"
        prependLinks={[[`/${pathRoot}/user-feedback/`, 'Set Up User Feedback']]}
        suppressMissing
        tree={tree}
      />
    </ul>
  );
}
