'use client';

import {Children, useState} from 'react';

import {getUnversionedPath} from 'sentry-docs/versioning';

import {SidebarLink} from './sidebarLink';

interface SidebarLinkProps {
  /**
   * The current page path being rendered
   */
  path: string;
  /**
   * The text of the link
   */
  title: string;
  to: string;

  /**
   * Shows a beta badge next to the title
   */
  beta?: boolean;

  /**
   * Children represent the additional links nested under this sidebar link
   */
  children?: React.ReactNode;
  className?: string;

  /**
   * Indicates that the links are currently hidden. Overridden by isActive
   */
  collapsed?: boolean | null;

  /**
   * Shows a new badge next to the title
   */
  isNew?: boolean;
}

/**
 * This client component is used to render a collapsible sidebar link.
 * It is only used by the DynamicNav component.
 */
export function CollapsibleSidebarLink({
  to,
  title,
  children,
  path,
  collapsed = null,
  className = '',
  beta = false,
  isNew = false,
}: SidebarLinkProps) {
  const isActive = path?.indexOf(to) === 0;
  const enableSubtree = isActive || collapsed === false;
  const hasSubtree = Children.count(children) > 0;

  const [showSubtree, setShowSubtree] = useState(enableSubtree);

  return (
    <li className={`toc-item ${className}`} data-sidebar-branch data-path={path}>
      <SidebarLink
        href={to}
        data-sidebar-link
        isActive={to === getUnversionedPath(path)}
        collapsible={hasSubtree}
        title={title}
        beta={beta}
        isNew={isNew}
        onClick={() => {
          // Allow toggling the sidebar subtree only if the item is selected
          if (path === to) {
            setShowSubtree(v => enableSubtree && !v);
          }
        }}
      />
      {showSubtree && <ul data-sidebar-tree>{children}</ul>}
    </li>
  );
}
