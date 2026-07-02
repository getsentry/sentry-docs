'use client';

import {useEffect, useState} from 'react';

type TreeItem = {
  children: TreeItem[];
  id: string;
  name: string;
};

type TreeNode = {
  element: HTMLElement;
  id: string;
  level: number;
  name: string;
};

interface Props {
  ignoreIds?: string[];
}

export function TableOfContents({ignoreIds = []}: Props) {
  const [treeItems, setTreeItems] = useState<TreeItem[]>([]);

  // gather the sdk option items on mount
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const main = document.getElementById('main');
    if (!main) {
      return;
    }
    const nodes = Array.from(main.querySelectorAll('h2, h3'))
      .map(el => {
        const name = el.textContent?.trim() ?? '';
        const id = el.id;
        if (!id || !name || ignoreIds.includes(id)) {
          return null;
        }
        return {
          id,
          name,
          element: el,
          level: el.tagName === 'H2' ? 1 : 2,
        };
      })
      .filter(Boolean) as TreeNode[];

    // Now group them together
    // We only support 2 levels of nesting for now
    const _tocItems: TreeItem[] = [];
    let currentItem: TreeItem | undefined;
    for (let node of nodes) {
      if (!currentItem || node.level === 1) {
        currentItem = {
          id: node.id,
          name: node.name,
          children: [],
        };
        _tocItems.push(currentItem);
      } else {
        currentItem.children.push({
          id: node.id,
          name: node.name,
          children: [],
        });
      }
    }

    setTreeItems(_tocItems);
  }, [ignoreIds]);

  // Track current hash to trigger scroll when it changes (e.g., browser back/forward)
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    // Initialize hash and listen for changes
    setCurrentHash(window.location.hash);
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Re-scroll to hash anchor after TOC renders to compensate for layout shift.
  // The TOC starts empty and populates client-side, which pushes content down
  // and causes the browser's initial anchor scroll to land on the wrong section.
  // This effect re-runs whenever the hash or treeItems change.
  //
  // Note: This causes a redundant scroll when clicking TOC links (browser scrolls,
  // then our effect scrolls again), but the performance impact is negligible and
  // ensures correct behavior for initial page loads and browser back/forward navigation.
  useEffect(() => {
    if (treeItems.length === 0 || !currentHash) {
      return undefined;
    }
    const rafId = requestAnimationFrame(() => {
      const id = decodeURIComponent(currentHash.slice(1));
      document.getElementById(id)?.scrollIntoView();
    });
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [currentHash, treeItems]);

  return (
    <ul>
      {treeItems.map(item => {
        return (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.name}</a>
            <ul>
              {item.children.map(child => {
                return (
                  <li key={child.id}>
                    <a href={`#${child.id}`}>{child.name}</a>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
