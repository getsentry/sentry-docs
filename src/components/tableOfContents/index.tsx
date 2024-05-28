'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

import {isTruthy} from 'sentry-docs/utils';

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

// The full, rendered page is required in order to generate the table of
// contents since headings can come from child components, included MDX files,
// etc. Even though this should hypothetically be doable on the server, methods
// like React's `renderToString` aren't supported in Next:
// https://github.com/vercel/next.js/discussions/57631
//
// For now, calculate the table of contents on the client.
export function TableOfContents() {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  // gather the toc items on mount
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const main = document.getElementById('main');
    if (!main) {
      throw new Error('#main element not found');
    }
    const tocItems_ = Array.from(main.querySelectorAll('h2, h3'))
      .map(el => {
        const title = el.textContent?.trim() ?? '';
        if (!el.id) {
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
      .filter(isTruthy);
    setTocItems(tocItems_);
  }, []);

  useEffect(() => {
    if (tocItems.length === 0) {
      return () => {};
    }
    // account for the header height
    const rootMarginTop = 100;
    // element is consiered in view if it is in the top 1/3 of the screen
    const rootMarginBottom = (2 / 3) * window.innerHeight - rootMarginTop;
    const observerOptions = {
      rootMargin: `${rootMarginTop}px 0px -${rootMarginBottom}px 0px`,
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
    return () => headings.forEach(heading => observer.unobserve(heading));
  }, [tocItems]);

  const router = useRouter();

  useEffect(() => {
    // sync the first visible heading fragment to url hash without polluting the history
    const firstVisible = tocItems.find(h => h.isActive);
    if (firstVisible) {
      router.replace(`#${firstVisible.element.id}`, {scroll: false});
    }
  }, [tocItems, router]);

  return (
    <div className={styles['doc-toc']}>
      {!!tocItems.length && (
        <div className={styles['doc-toc-title']}>
          <h6>On this page</h6>
        </div>
      )}
      <ul className={styles['section-nav']}>{recursiveRender(buildTocTree(tocItems))}</ul>
    </div>
  );
}
