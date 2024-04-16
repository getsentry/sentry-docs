'use client';

import {useEffect, useState} from 'react';

import styles from './style.module.scss';

interface TocItem {
  depth: number;
  url: string;
  value: string;
  children?: TocItem[];
}

function recursiveRender(items: TocItem[]) {
  return items.map(i => {
    if (!i.value) {
      return recursiveRender(i.children || []);
    }
    return (
      <li className={styles['toc-entry']} key={i.url}>
        <a href={`${i.url}`}>{i.value}</a>
        {i.children && <ul>{recursiveRender(i.children)}</ul>}
      </li>
    );
  });
}

function buildTocTree(toc: TocItem[]): TocItem[] {
  // Maintains our final constructed tree of TocItem's
  const items: TocItem[] = [];

  // Used to aid in cosntructing our tree by maintaining the stack of items
  // ordered by depth.
  const stack: TocItem[] = [];

  for (const heading of toc) {
    const item: TocItem = {...heading, children: []};

    // pop from the stack until the we reach the item with a level greater than
    // the heading we currently have
    while (stack.length > 0 && stack[stack.length - 1].depth >= heading.depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      // Heading is at the highest level
      items.push(item);
    } else {
      // Heading is a child of the most recent item in the stack
      stack[stack.length - 1].children?.push(item);
    }

    stack.push(item);
  }

  return items;
}

// The full, rendered page is required in order to generate the table of
// contents since headings can come from child components, included MDX files,
// etc. Even though this should hypothetically be doable on the server, methods
// like React's `renderToString` aren't supported in Next:
// https://github.com/vercel/next.js/discussions/57631
//
// For now, calculate the table of contents on the client.
export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const main = document.getElementById('main');
      const elements = main?.querySelectorAll('h2, h3');
      const tocItems: TocItem[] = [];
      elements?.forEach(e => {
        const title = e.textContent?.trim();
        const {id} = e;
        if (title && id) {
          tocItems.push({
            depth: e.tagName === 'H2' ? 2 : 3,
            url: `#${id}`,
            value: title,
          });
        }
      });
      setHeadings(tocItems);
    }
  }, []);

  return (
    <div className={styles['doc-toc']}>
      {!!headings.length && (
        <div className={styles['doc-toc-title']}>
          <h6>On this page</h6>
        </div>
      )}
      <ul className={styles['section-nav']}>{recursiveRender(buildTocTree(headings))}</ul>
    </div>
  );
}
