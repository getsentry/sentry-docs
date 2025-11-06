import {DocNode, nodeForPath} from 'sentry-docs/docTree';

import styles from './style.module.scss';

import {DynamicNav, toTree} from './dynamicNav';
import {SidebarLink, SidebarSeparator} from './sidebarLink';
import {NavNode} from './types';
import {docNodeToNavNode, getNavNodes} from './utils';

import { useGT, msg, useMessages } from 'gt-next';

const devDocsMenuItems: {root: string; title: string}[] = [
  {root: 'getting-started', title: msg('Getting Started')},
  {root: 'engineering-practices', title: msg('Engineering Practices')},
  {root: 'application-architecture', title: msg('Application Architecture')},
  {root: 'development-infrastructure', title: msg('Development Infrastructure')},
  {root: 'backend', title: msg('Backend')},
  {root: 'frontend', title: msg('Frontend')},
  {root: 'services', title: msg('Services')},
  {root: 'integrations', title: msg('Integrations')},
  {root: 'ingestion', title: msg('Ingestion')},
  {root: 'sdk', title: msg('SDKs')},
  {root: 'self-hosted', title: msg('Self-Hosted Sentry')},
];

export function DevelopDocsSidebar({
  rootNode,
  sidebarToggleId,
}: {
  path: string;
  rootNode: DocNode;
  sidebarToggleId: string;
}) {
  const gt = useGT();
  const m = useMessages();
  const getNavTree = (root: string) => {
    const apiNodes: NavNode[] = getNavNodes(
      [nodeForPath(rootNode, root)!],
      docNodeToNavNode
    );
    return toTree(apiNodes);
  };
  return (
    <aside className={`${styles.sidebar} p-3`} data-layout-anchor="left">
      <input type="checkbox" id={sidebarToggleId} className="hidden" />
      <style>{':root { --sidebar-width: 300px; }'}</style>
      <div className="md:flex flex-col items-stretch">
        <div className={styles.toc}>
          <ul data-sidebar-tree>
            {devDocsMenuItems.map(({root, title}) => (
              <DynamicNav
                key={root}
                root={root}
                title={m(title)}
                tree={getNavTree(root)}
                collapsible
              />
            ))}
          </ul>
          <SidebarSeparator />
          <ul data-sidebar-tree>
            <SidebarLink
              href="https://open.sentry.io/code-of-conduct/"
              title={gt('Code of Conduct')}
            />
            <SidebarLink href="https://docs.sentry.io" title={gt('User Documentation')} />
          </ul>
        </div>
      </div>
    </aside>
  );
}
