'use client';

/**
 * Collapsible wrapper for the right sidebar that contains
 * both the table of contents and platform SDK details
 */

import {ReactNode, useState} from 'react';

import styles from './style.module.scss';

type CollapsibleRightSidebarProps = {
  children: ReactNode;
};

export function CollapsibleRightSidebar({children}: CollapsibleRightSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside
      data-layout-anchor="right"
      className={`${styles.collapsibleSidebar} ${isExpanded ? styles.expanded : styles.collapsed} h-[calc(100vh-var(--header-height))] top-[var(--header-height)] right-0 overflow-y-auto hidden toc:block flex-none`}
    >
      <button
        className={`${styles.collapseToggle} ${isExpanded ? styles.active : ''}`}
        onClick={handleToggle}
        aria-label={isExpanded ? 'Hide table of contents' : 'Show table of contents'}
        title={isExpanded ? 'Hide table of contents' : 'Show table of contents'}
      >
        📖
      </button>
      {isExpanded && <div className="sidebar">{children}</div>}
    </aside>
  );
}
