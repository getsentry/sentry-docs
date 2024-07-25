import {DocNode, nodeForPath} from 'sentry-docs/docTree';

import styles from './style.module.scss';

import {DynamicNav, toTree} from '../dynamicNav';
import {SidebarLink} from '../sidebarLink';

import {NavNode} from './types';
import {docNodeToNavNode, getNavNodes} from './utils';

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
            <DynamicNav
              root="getting-started"
              title="Getting Started"
              tree={getNavTree('getting-started')}
              headerClassName={headerClassName}
              collapse
            />

            <DynamicNav
              root="development"
              title="Development"
              tree={getNavTree('development')}
              headerClassName={headerClassName}
              collapse
            />

            <DynamicNav
              root="application"
              title="Application"
              tree={getNavTree('application')}
              headerClassName={headerClassName}
              collapse
            />

            <DynamicNav
              root="frontend"
              title="Frontend"
              tree={getNavTree('frontend')}
              headerClassName={headerClassName}
              collapse
            />

            <DynamicNav
              root="backend"
              title="Backend"
              tree={getNavTree('backend')}
              headerClassName={headerClassName}
              collapse
            />

            <DynamicNav
              root="sdk"
              title="SDK Development"
              tree={getNavTree('sdk')}
              headerClassName={headerClassName}
              collapse
            />

            <DynamicNav
              root="services"
              title="Services"
              tree={getNavTree('services')}
              headerClassName={headerClassName}
              collapse
            />

            <DynamicNav
              root="integrations"
              title="Integrations"
              tree={getNavTree('integrations')}
              headerClassName={headerClassName}
              collapse
            />

            <DynamicNav
              root="self-hosted"
              title="Self-Hosted Sentry"
              tree={getNavTree('self-hosted')}
              headerClassName={headerClassName}
              collapse
            />
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
