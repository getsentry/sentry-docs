import {DocNode, nodeForPath} from 'sentry-docs/docTree';

import styles from './style.module.scss';

import {DynamicNav, toTree} from './dynamicNav';
import {SidebarLink, SidebarSeparator} from './sidebarLink';
import {NavNode} from './types';
import {docNodeToNavNode, getNavNodes} from './utils';

const devDocsMenuItems: {root: string; title: string}[] = [
  {root: 'getting-started', title: 'Getting Started'},
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
  rootNode,
  sidebarToggleId,
}: {
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
    <aside className={`${styles.sidebar} p-3`}>
      <input type="checkbox" id={sidebarToggleId} className="hidden" />
      <style>{':root { --sidebar-width: 300px; }'}</style>
      <div className="md:flex flex-col items-stretch">
        <div className={styles.toc}>
          <ul data-sidebar-tree>
            {devDocsMenuItems.map(({root, title}) => (
              <DynamicNav
                key={root}
                root={root}
                title={title}
                tree={getNavTree(root)}
                collapsible
              />
            ))}
          </ul>
          <SidebarSeparator />
          <ul data-sidebar-tree>
            <SidebarLink
              href="https://open.sentry.io/code-of-conduct/"
              title="Code of Conduct"
            />
            <SidebarLink href="https://docs.sentry.io" title="User Documentation" />
          </ul>
        </div>
      </div>
    </aside>
  );
}
