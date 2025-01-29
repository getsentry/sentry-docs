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

export function SdkOptionsOverview() {
  const [treeItems, setTreeItems] = useState<TreeItem[]>([]);

  // gather the sdk option items on mount
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const main = document.getElementById('main');
    if (!main) {
      throw new Error('#main element not found');
    }
    const nodes = Array.from(main.querySelectorAll('h2, h3'))
      .map(el => {
        const name = el.textContent?.trim() ?? '';
        const id = el.id;
        if (!id || !name) {
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
    // We only support 2 levels of nesting,
    // where the first level is assumed to be headings, and the second one is assumed to be options
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
      } else if (node.element.hasAttribute('data-sdk-option')) {
        currentItem.children.push({
          id: node.id,
          name: node.name,
          children: [],
        });
      }
    }

    // Remove groups without children
    setTreeItems(_tocItems.filter(item => item.children.length > 0));
  }, []);

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
