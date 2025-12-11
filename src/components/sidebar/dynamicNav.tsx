import {Fragment} from 'react';
import Link from 'next/link';

import {serverContext} from 'sentry-docs/serverContext';
import {sortPages} from 'sentry-docs/utils';
import {getUnversionedPath, VERSION_INDICATOR} from 'sentry-docs/versioning';

import {CollapsibleSidebarLink} from './collapsibleSidebarLink';
import {SidebarLink, SidebarSeparator} from './sidebarLink';

// Section configuration for sidebar organization
const SECTION_LABELS: Record<string, string> = {
  features: 'Features',
  configuration: 'Configuration',
};

// Section links configuration - sections that should be clickable headers
const SECTION_LINKS: Record<string, string> = {
  features: 'features',
};

const SECTION_ORDER = ['features', 'configuration'] as const;

type Node = {
  [key: string]: any;
  context: {
    [key: string]: any;
    beta?: boolean;
    new?: boolean;
    section_end_divider?: boolean;
    sidebar_hidden?: boolean;
    sidebar_order?: number;
    sidebar_section?: 'features' | 'configuration';
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
  depth: number = 0,
  rootPath?: string
): React.ReactNode[] => {
  const sortedChildren = sortPages(
    children.filter(
      ({name, node}) =>
        node &&
        !!node.context.title &&
        name !== '' &&
        exclude.indexOf(node.path) === -1 &&
        !node.context.sidebar_hidden
    ),
    ({node}) => node!
  );

  const result: React.ReactNode[] = [];

  // Only group by sections at the top level (depth === 0)
  if (depth === 0) {
    // Group children by section
    const sectioned: Record<string, EntityTree[]> = {};
    const unsectioned: EntityTree[] = [];

    sortedChildren.forEach(item => {
      const section = item.node?.context.sidebar_section;
      if (section && SECTION_ORDER.includes(section)) {
        if (!sectioned[section]) {
          sectioned[section] = [];
        }
        sectioned[section].push(item);
      } else {
        // Items without a section appear at the top
        unsectioned.push(item);
      }
    });

    // First, render unsectioned items (fallback behavior)
    unsectioned.forEach(({node, children: nodeChildren}) => {
      if (!node) {
        return;
      }

      result.push(
        <CollapsibleSidebarLink
          to={node.path}
          key={node.path}
          title={node.context.sidebar_title || node.context.title!}
          collapsed={depth >= showDepth}
          path={path}
          beta={node.context.beta}
          isNew={node.context.new}
        >
          {renderChildren(nodeChildren, exclude, path, showDepth, depth + 1, rootPath)}
        </CollapsibleSidebarLink>
      );

      // Keep backwards compatibility with section_end_divider
      if (node.context.section_end_divider) {
        result.push(<SidebarSeparator key={`separator-${node.path}`} />);
      }
    });

    // Then render sections in order
    SECTION_ORDER.forEach((sectionKey, sectionIndex) => {
      const sectionItems = sectioned[sectionKey];
      if (!sectionItems || sectionItems.length === 0) {
        return;
      }

      // Add separator before section (add even before first section if there are unsectioned items)
      if (sectionIndex > 0 || unsectioned.length > 0) {
        result.push(<SidebarSeparator key={`sep-${sectionKey}`} />);
      }

      // Add section header (with optional link)
      const sectionLink = SECTION_LINKS[sectionKey];
      const sectionHref = sectionLink && rootPath ? `/${rootPath}/${sectionLink}/` : null;

      result.push(
        <li
          key={`header-${sectionKey}`}
          className="sidebar-section-header text-xs font-semibold text-gray-11 uppercase tracking-wider px-2 py-2 mt-2"
        >
          {sectionHref ? (
            <Link href={sectionHref} className="hover:text-purple no-underline">
              {SECTION_LABELS[sectionKey]}
            </Link>
          ) : (
            SECTION_LABELS[sectionKey]
          )}
        </li>
      );

      // Render items in this section
      sectionItems.forEach(({node, children: nodeChildren}) => {
        if (!node) {
          return;
        }

        result.push(
          <CollapsibleSidebarLink
            to={node.path}
            key={node.path}
            title={node.context.sidebar_title || node.context.title!}
            collapsed={depth >= showDepth}
            path={path}
            beta={node.context.beta}
            isNew={node.context.new}
          >
            {renderChildren(nodeChildren, exclude, path, showDepth, depth + 1, rootPath)}
          </CollapsibleSidebarLink>
        );

        // Keep backwards compatibility with section_end_divider
        if (node.context.section_end_divider) {
          result.push(<SidebarSeparator key={`separator-${node.path}`} />);
        }
      });
    });
  } else {
    // For nested items (depth > 0), render normally without sections
    sortedChildren.forEach(({node, children: nodeChildren}) => {
      if (!node) {
        return;
      }

      result.push(
        <CollapsibleSidebarLink
          to={node.path}
          key={node.path}
          title={node.context.sidebar_title || node.context.title!}
          collapsed={depth >= showDepth}
          path={path}
          beta={node.context.beta}
          isNew={node.context.new}
        >
          {renderChildren(nodeChildren, exclude, path, showDepth, depth + 1, rootPath)}
        </CollapsibleSidebarLink>
      );
    });
  }

  return result;
};

type ChildrenProps = {
  path: string;
  tree: EntityTree[];
  exclude?: string[];
  rootPath?: string;
  showDepth?: number;
};

export function Children({
  tree,
  path,
  exclude = [],
  showDepth = 0,
  rootPath,
}: ChildrenProps) {
  return (
    <Fragment>{renderChildren(tree, exclude, path, showDepth, 0, rootPath)}</Fragment>
  );
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
  const isActive = path.join('/').indexOf(root) === 0;
  const linkPath = `/${path.join('/')}/`;
  const unversionedPath = getUnversionedPath(path, false);

  // For platform sidebars (SDK documentation), we want to show a "Quick Start" link
  // instead of making the section header itself selectable
  const isPlatformSidebar = root.startsWith('platforms/');

  const header = (
    <SidebarLink
      href={`/${root}/`}
      title={title}
      collapsible={collapsible}
      isActive={!isPlatformSidebar && unversionedPath === root}
      topLevel
      data-sidebar-link
    />
  );

  return (
    <li className="mb-3" data-sidebar-branch>
      {header}
      {(!collapsible || isActive) && entity.children && (
        <ul data-sidebar-tree className="pl-3">
          {isPlatformSidebar && (
            <CollapsibleSidebarLink
              to={`/${root}/`}
              title="Quick Start"
              collapsed={false}
              path={linkPath}
              key={`${root}-quickstart`}
            >
              {[]}
            </CollapsibleSidebarLink>
          )}
          <Children
            tree={entity.children}
            exclude={exclude}
            showDepth={0}
            path={linkPath}
            rootPath={root}
          />
        </ul>
      )}
    </li>
  );
}
