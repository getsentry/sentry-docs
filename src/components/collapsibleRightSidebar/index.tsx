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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsExpanded(false);
    }
  };

  const handleTogglePin = () => {
    setIsPinned(!isPinned);
    setIsExpanded(!isPinned); // Expand when pinning, collapse when unpinning
  };

  return (
    <aside
      data-layout-anchor="right"
      className={`${styles.collapsibleSidebar} ${isExpanded ? styles.expanded : styles.collapsed} h-[calc(100vh-var(--header-height))] top-[var(--header-height)] right-0 overflow-y-auto hidden toc:block flex-none`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`${styles.collapseToggle} ${isPinned ? styles.pinned : ''}`}
        onClick={handleTogglePin}
        aria-label={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
        title={isPinned ? 'Unpin sidebar (auto-collapse on hover out)' : 'Pin sidebar (keep expanded)'}
      >
        {isPinned ? '📌' : '←'}
      </button>
      {isExpanded && <div className="sidebar">{children}</div>}
    </aside>
  );
}

