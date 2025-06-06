import {Fragment} from 'react';

import {serverContext} from 'sentry-docs/serverContext';
import {sortPages} from 'sentry-docs/utils';
import {getUnversionedPath, VERSION_INDICATOR} from 'sentry-docs/versioning';

import {CollapsibleSidebarLink} from './collapsibleSidebarLink';
import {SidebarLink} from './sidebarLink';

type Node = {
  [key: string]: any;
  context: {
    [key: string]: any;
    sidebar_hidden?: boolean;
    sidebar_order?: number;
    sidebar_title?: string;
    title?: string;
  };
  path: string;
};

type Entity<T> = {
  children: T[];
  name: string;
  node: Node | null;
};

export interface EntityTree extends Entity<EntityTree> {}

export const toTree = (nodeList: Node[]): EntityTree[] => {
  const result: EntityTree[] = [];
  const level = {result};
  nodeList
    .sort((a, b) => a.path.localeCompare(b.path))
    .forEach(node => {
      let curPath = '';

      // hide versioned pages in sidebar
      if (!node.path.includes(VERSION_INDICATOR)) {
        node.path.split('/').reduce((r, name: string) => {
          curPath += `${name}/`;
          if (!r[name]) {
            r[name] = {result: []};
            r.result.push({
              name,
              children: r[name].result,
              node: curPath === node.path ? node : null,
            });
          }

          return r[name];
        }, level);
      }
    });

  return result.length > 0 ? result[0].children : [];
};

export const renderChildren = (
  children: EntityTree[],
  exclude: string[],
  path: string,
  showDepth: number = 0,
  depth: number = 0
): React.ReactNode[] => {
  return sortPages(
    children.filter(
      ({name, node}) =>
        node &&
        !!node.context.title &&
        name !== '' &&
        exclude.indexOf(node.path) === -1 &&
        !node.context.sidebar_hidden
    ),
    ({node}) => node!
  ).map(({node, children: nodeChildren}) => {
    // will not be null because of the filter above
    if (!node) {
      return null;
    }
    return (
      <CollapsibleSidebarLink
        to={node.path}
        key={node.path}
        title={node.context.sidebar_title || node.context.title!}
        collapsed={depth >= showDepth}
        path={path}
      >
        {renderChildren(nodeChildren, exclude, path, showDepth, depth + 1)}
      </CollapsibleSidebarLink>
    );
  });
};

type ChildrenProps = {
  path: string;
  tree: EntityTree[];
  exclude?: string[];
  showDepth?: number;
};

export function Children({tree, path, exclude = [], showDepth = 0}: ChildrenProps) {
  return <Fragment>{renderChildren(tree, exclude, path, showDepth)}</Fragment>;
}

type Props = {
  root: string;
  tree: EntityTree[];
  collapsible?: boolean;
  exclude?: string[];
  title?: string;
};

export function DynamicNav({
  root,
  title,
  tree,
  collapsible = false,
  exclude = [],
}: Props) {
  if (root.startsWith('/')) {
    root = root.substring(1);
  }

  let entity: EntityTree | undefined;
  let currentTree = tree;
  const rootBits = root.split('/');
  rootBits.forEach(bit => {
    entity = currentTree.find(n => n.name === bit);
    if (!entity) {
      throw new Error(`Could not find entity at ${root} (specifically at ${bit})`);
    }
    currentTree = entity.children;
  });
  if (!entity) {
    return null;
  }
  if (!title && entity.node) {
    title = entity.node.context.sidebar_title || entity.node.context.title || '';
  }
  if (!title) {
    return null;
  }
  const parentNode = entity.children?.find((n: EntityTree) => n.name === '');

  if (!parentNode) {
    throw new Error(`Could not find parentNode at ${root}`);
  }

  const {path} = serverContext();
  const isActive = getUnversionedPath(path, false) === root;
  const linkPath = `/${path.join('/')}/`;

  const header = (
    <SidebarLink
      href={`/${root}/`}
      title={title}
      collapsible={collapsible}
      isActive={getUnversionedPath(path, false) === root}
      topLevel
      data-sidebar-link
    />
  );

  return (
    <li className="mb-3" data-sidebar-branch>
      {header}
      {entity.children && entity.children.length > 0 && (!collapsible || isActive) && (
        <ul data-sidebar-tree className="pl-3">
          <Children
            tree={entity.children}
            exclude={exclude}
            showDepth={0}
            path={linkPath}
          />
        </ul>
      )}
    </li>
  );
}
