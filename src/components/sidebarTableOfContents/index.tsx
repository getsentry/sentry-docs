'use client';

import {useEffect, useState} from 'react';

import {isNotNil} from 'sentry-docs/utils';

import styles from './style.module.scss';

interface TocItem {
  depth: number;
  element: Element;
  isActive: boolean;
  title: string;
  url: string;
  children?: TocItem[];
}

function recursiveRender(items: TocItem[]) {
  return items.map(i => {
    if (!i.title) {
      return recursiveRender(i.children || []);
    }
    const getMarkerLeft = (depth: number) => {
      return depth === 2 ? '-1rem' : depth === 3 ? '-1.75rem' : '-2.5rem';
    };
    return (
      <li
        className={`${styles['toc-entry']} ${i.isActive ? styles.active : ''}`}
        key={i.url}
        style={
          {
            '--active-marker-left': getMarkerLeft(i.depth),
          } as React.CSSProperties
        }
      >
        <a href={`${i.url}`}>{i.title}</a>
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

function getTocItems(main: HTMLElement) {
  return Array.from(main.querySelectorAll('h2, h3'))
    .map(el => {
      const title = el.textContent?.trim();
      if (!el.id || !title) {
        return null;
      }
      // This is a relatively new API, that checks if the element is visible in the document
      // With this, we filter out e.g. sections hidden via CSS
      if (typeof el.checkVisibility === 'function' && !el.checkVisibility()) {
        return null;
      }
      return {
        depth: el.tagName === 'H2' ? 2 : 3,
        url: `#${el.id}`,
        title,
        element: el,
        isActive: false,
      };
    })
    .filter(isNotNil);
}

function getMainElement() {
  if (typeof document === 'undefined') {
    return null;
  }
  return document.getElementById('main');
}

// The full, rendered page is required in order to generate the table of
// contents since headings can come from child components, included MDX files,
// etc. Even though this should hypothetically be doable on the server, methods
// like React's `renderToString` aren't supported in Next:
// https://github.com/vercel/next.js/discussions/57631
//
// For now, calculate the table of contents on the client.
export function SidebarTableOfContents() {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  // gather the toc items on mount
  useEffect(() => {
    const main = getMainElement();
    if (!main) {
      return;
    }

    setTocItems(getTocItems(main));
  }, []);

  // ensure toc items are kept up-to-date if the DOM changes
  useEffect(() => {
    const main = getMainElement();
    if (!main) {
      return () => {};
    }

    const observer = new MutationObserver(() => {
      const newTocItems = getTocItems(main);

      // Avoid flashing sidebar elements if nothing changes
      if (
        newTocItems.length === tocItems.length &&
        newTocItems.every((item, index) => item.url === tocItems[index].url)
      ) {
        return;
      }
      setTocItems(newTocItems);
    });

    // Start observing the target node for any changes in its subtree
    // We only care about:
    // * Children being added/removed (childList)
    // Any id, class, or style attribute being changed (this approximates CSS changes)
    observer.observe(main, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id', 'style'],
    });

    return () => observer.disconnect();
  }, [tocItems]);

  // Mark the active item based on the scroll position
  useEffect(() => {
    const innerHeight = window.innerHeight;
    if (!tocItems.length || !innerHeight) {
      return () => {};
    }
    // account for the header height
    const rootMarginTop = 100;
    // element is consiered in view if it is in the top 1/3 of the screen
    const rootMarginBottomRaw = (2 / 3) * innerHeight - rootMarginTop;
    const rootMarginBottom = Math.floor(rootMarginBottomRaw) * -1;
    const observerOptions = {
      rootMargin: `${rootMarginTop}px 0px ${rootMarginBottom}px 0px`,
      threshold: 1,
    };
    const observer = new IntersectionObserver(entries => {
      const firstVisibleItem = entries.find(
        item => item.isIntersecting && item.intersectionRatio === 1
      );
      const setActive = (tocItem: TocItem) => ({
        ...tocItem,
        isActive: tocItem.element.id === firstVisibleItem!.target.id,
      });
      if (firstVisibleItem) {
        setTocItems(items => items.map(setActive));
      }
    }, observerOptions);
    const headings = tocItems.map(item => item.element);
    headings.forEach(heading => observer.observe(heading));
    return () => observer.disconnect();
  }, [tocItems]);

  return (
    <div className={styles['doc-toc']}>
      {!!tocItems.length && <h2 className={styles['doc-toc-title']}>On this page</h2>}
      <ul className={styles['section-nav']}>{recursiveRender(buildTocTree(tocItems))}</ul>
    </div>
  );
}
