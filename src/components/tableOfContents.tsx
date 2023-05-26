import React, {Fragment, useEffect, useState} from 'react';

import {captureException} from '../utils';

import {PageContext} from './basePage';
import GuideGrid from './guideGrid';

type Item = {
  items: Item[];
  title?: string;
  url?: string;
};

const getHeadings = (element: HTMLElement): Item[] => {
  const levels = [2, 3];
  const headingSelector = levels.map(level => `h${level}`).join(`, `);
  const htmlNodes: HTMLElement[] = Array.from(element.querySelectorAll(headingSelector));
  const headings = [];
  const tree = [];
  let lastDepth = null;
  // XXX(dcramer): someone please rewrite this code to be less terrible, i hate trees
  // TODO(dcramer): this doesnt handle jumping heading levels properly (probably)
  htmlNodes.forEach(node => {
    if (!node.id) {
      return;
    }
    const item = {
      items: [],
      url: `#${node.id}`,
      title: node.innerText,
    };

    const depth = Number(node.nodeName[1]);
    if (!lastDepth) {
      headings.push(item);
      tree.push(item);
    } else if (lastDepth === depth) {
      if (tree.length === 1) {
        headings.push(item);
      } else {
        tree[tree.length - 2].items.push(item);
      }
      tree[tree.length - 1] = item;
    } else if (depth > lastDepth) {
      tree[tree.length - 1].items.push(item);
      tree.push(item);
    } else if (depth < lastDepth) {
      tree.pop();
      if (tree.length === 1) {
        headings.push(item);
      } else {
        tree[tree.length - 2].items.push(item);
      }
      tree[tree.length - 1] = item;
    }
    lastDepth = depth;
  });
  return headings;
};

type Props = {
  contentRef: React.RefObject<HTMLElement>;
  pageContext?: PageContext;
};

function recursiveRender(items) {
  return items.map(i => {
    if (!i.title) {
      return recursiveRender(i.items);
    }
    return (
      <li className="toc-entry" key={i.url}>
        <a href={i.url}>{i.title}</a>
        {i.items && <ul>{recursiveRender(i.items)}</ul>}
      </li>
    );
  });
}

export default function TableOfContents({contentRef, pageContext}: Props) {
  const [items, setItems] = useState<Item[]>(null);
  const {platform} = pageContext;

  useEffect(() => {
    if (!items && contentRef.current) {
      try {
        setItems(getHeadings(contentRef.current));
      } catch (err) {
        captureException(err);
        setItems([]);
      }
    }
  }, [contentRef, items]);

  if (!items || !items.length) {
    return null;
  }

  return (
    <div className="doc-toc">
      <div className="doc-toc-title">
        <h6>On this page</h6>
      </div>
      <ul className="section-nav">{recursiveRender(items)}</ul>
      {platform && (
        <Fragment>
          <div className="doc-toc-title">
            <h6>Related Guides</h6>
          </div>
          <GuideGrid platform={platform.name} className="section-nav" />
        </Fragment>
      )}
    </div>
  );
}
