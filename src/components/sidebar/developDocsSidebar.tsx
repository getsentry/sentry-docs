import {DocNode, nodeForPath} from 'sentry-docs/docTree';

import styles from './style.module.scss';

import {DynamicNav, toTree} from '../dynamicNav';
import {SidebarLink} from '../sidebarLink';

import {NavNode} from './types';
import {docNodeToNavNode, getNavNodes} from './utils';

const devDocsMenuItems: {root: string; title: string; hideChevron?: boolean}[] = [
  {root: 'getting-started', title: 'Getting Started', hideChevron: true},
  {root: 'engineering-practices', title: 'Engineering Practices'},
  {root: 'application-architecture', title: 'Application Architecture'},
  {root: 'development-infrastructure', title: 'Development Infrastructure'},
  {root: 'backend', title: 'Backend'},
  {root: 'frontend', title: 'Frontend'},
  {root: 'services', title: 'Services'},
  {root: 'integrations', title: 'Integrations'},
  {root: 'ingestion', title: 'Ingestion'},
  {root: 'sdk', title: 'SDKs'},
  {root: 'self-hosted', title: 'Self-Hosted Sentry'},
];

export function DevelopDocsSidebar({
  path,
  rootNode,
  sidebarToggleId,
  headerClassName,
}: {
  headerClassName: string;
  path: string;
  rootNode: DocNode;
  sidebarToggleId: string;
}) {
  const getNavTree = (root: string) => {
    const apiNodes: NavNode[] = getNavNodes(
      [nodeForPath(rootNode, root)!],
      docNodeToNavNode
    );
    return toTree(apiNodes);
  };
  return (
    <aside className={styles.sidebar}>
      <input type="checkbox" id={sidebarToggleId} className="hidden" />
      <style>{':root { --sidebar-width: 300px; }'}</style>
      <div className="md:flex flex-col items-stretch">
        <div className={styles.toc}>
          <ul data-sidebar-tree>
            {devDocsMenuItems.map(({root, title, hideChevron}) => (
              <DynamicNav
                key={root}
                root={root}
                title={title}
                tree={getNavTree(root)}
                headerClassName={headerClassName}
                collapse
                withChevron={!hideChevron}
              />
            ))}
          </ul>
          <hr />
          <ul data-sidebar-tree>
            <SidebarLink
              to="https://open.sentry.io/code-of-conduct/"
              title="Code of Conduct"
              path={path}
            />
            <SidebarLink
              to="https://docs.sentry.io"
              title="User Documentation"
              path={path}
            />
          </ul>
        </div>
      </div>
    </aside>
  );
}
