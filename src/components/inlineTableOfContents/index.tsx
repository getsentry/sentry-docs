'use client';

import {useEffect, useState} from 'react';

import {isNotNil} from 'sentry-docs/utils';

import styles from './style.module.scss';

interface TocItem {
  title: string;
  url: string;
}

function getMainElement() {
  if (typeof document === 'undefined') {
    return null;
  }
  return document.getElementById('main');
}

function getTocItems(main: HTMLElement): TocItem[] {
  return Array.from(main.querySelectorAll('h2'))
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
        url: `#${el.id}`,
        title,
      };
    })
    .filter(isNotNil);
}

// Inline table of contents that appears at the top of the page content
// Shows only H2 headings, and only appears if there are 3 or more sections
export function InlineTableOfContents() {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  // gather the toc items on mount
  useEffect(() => {
    const main = getMainElement();
    if (!main) {
      return;
    }

    const items = getTocItems(main);
    setTocItems(items);
  }, []);

  // ensure toc items are kept up-to-date if the DOM changes
  useEffect(() => {
    const main = getMainElement();
    if (!main) {
      return () => {};
    }

    const observer = new MutationObserver(() => {
      const newTocItems = getTocItems(main);

      // Avoid flashing if nothing changes
      if (
        newTocItems.length === tocItems.length &&
        newTocItems.every((item, index) => item.url === tocItems[index].url)
      ) {
        return;
      }
      setTocItems(newTocItems);
    });

    // Start observing the target node for any changes in its subtree
    observer.observe(main, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id', 'style'],
    });

    return () => observer.disconnect();
  }, [tocItems]);

  // Only show if there are 3 or more sections
  if (tocItems.length < 3) {
    return null;
  }

  return (
    <div className={styles['inline-toc']}>
      <div className={styles['inline-toc-title']}>On this page</div>
      <ul className={styles['inline-toc-list']}>
        {tocItems.map(item => (
          <li key={item.url}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

