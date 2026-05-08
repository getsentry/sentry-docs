'use client';

import {useEffect, useRef, useState} from 'react';

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

  // Re-scroll to hash anchor after TOC renders to compensate for layout shift.
  // The TOC starts empty and populates client-side, which pushes content down
  // and causes the browser's initial anchor scroll to land on the wrong section.
  const hasScrolledToHash = useRef(false);
  useEffect(() => {
    if (hasScrolledToHash.current || treeItems.length === 0) {
      return;
    }
    const hash = window.location.hash;
    if (!hash) {
      return;
    }
    hasScrolledToHash.current = true;
    requestAnimationFrame(() => {
      const id = decodeURIComponent(hash.slice(1));
      document.getElementById(id)?.scrollIntoView();
    });
  }, [treeItems]);

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
