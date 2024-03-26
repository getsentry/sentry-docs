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
        exclude={[`/${pathRoot}/guides/`]}
      />
    </ul>
  );
}
