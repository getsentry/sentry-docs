import React, { useEffect, useState } from "react";
import * as Sentry from "@sentry/gatsby";

type Item = {
  title?: string;
  url?: string;
  items: Item[];
};

const getHeadings = (element: HTMLElement): Item[] => {
  const levels = [2, 3];
  const headingSelector = levels.map(level => `h${level}`).join(`, `);
  const htmlNodes: HTMLElement[] = Array.from(
    element.querySelectorAll(headingSelector)
  );
  const headings = [];
  const tree = [];
  let lastDepth = null;
  // XXX(dcramer): someone please rewrite this code to be less terrible, i hate trees
  // TODO(dcramer): this doesnt handle jumping heading levels properly (probably)
  htmlNodes.forEach((node, i) => {
    if (!node.id) return;
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
};

export default ({ contentRef }: Props) => {
  const [items, setItems] = useState<Item[]>(null);

  useEffect(() => {
    if (!items && contentRef.current) {
      try {
        setItems(getHeadings(contentRef.current));
      } catch (err) {
        Sentry.captureException(err);
        setItems([]);
      }
    }
  });

  if (!items || !items.length) return null;

  const recurse = items =>
    items.map(i => {
      if (!i.title) return recurse(i.items);
      return (
        <li className="toc-entry" key={i.url}>
          <a href={i.url}>{i.title}</a>
          {i.items && <ul>{recurse(i.items)}</ul>}
        </li>
      );
    });
  return (
    <div className="doc-toc">
      <div className="doc-toc-title">
        <h6>On this page</h6>
      </div>
      <ul className="section-nav">{recurse(items)}</ul>
    </div>
  );
};
