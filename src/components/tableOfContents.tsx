import React, {Fragment, useMemo} from 'react';

import {PageContext} from './basePage';
import {GuideGrid} from './guideGrid';

interface Heading {
  id: string;
  level: number;
  title: string;
}

interface GetAnchorHeadingOptions {
  /**
   * The DOM element to extract heading nodes from
   */
  content: HTMLElement;
  /**
   * The levels to look for. These should be in consecutive order.
   */
  levels?: `h${number}`[];
}

/**
 * Extract a list of Heading objects from the content of a HTML element
 * containing various headings.
 */
function getAnchorHeadings({content, levels = ['h2', 'h3']}: GetAnchorHeadingOptions) {
  const headingNodes = [
    ...content.querySelectorAll<HTMLHeadingElement>(levels.join(', ')),
  ];

  const headings: Heading[] = headingNodes
    .filter(node => !!node.id)
    .map(node => ({
      title: node.innerText,
      level: Number(node.nodeName[1]),
      id: node.id,
    }));

  return headings;
}

interface TocItem extends Heading {
  /**
   * Child elements of the TocItem
   */
  items: TocItem[];
}

/**
 * Constructs a tree of `TocItem` nodes given a HTMLElement containing various
 * headings. The tree will be constructed as each heading apperas within the list.
 */
export function buildTocTree(headings: Heading[]): TocItem[] {
  // Maintains our final constructed tree of TocItem's
  const items: TocItem[] = [];

  // Used to aid in cosntructing our tree by maintaining the stack of items
  // ordered by depth.
  const stack: TocItem[] = [];

  for (const heading of headings) {
    const item: TocItem = {...heading, items: []};

    // pop from the stack until the we reach the item with a level greater than
    // the heading we currently have
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      // Heading is at the highest level
      items.push(item);
    } else {
      // Heading is a child of the most recent item in the stack
      stack[stack.length - 1].items.push(item);
    }

    stack.push(item);
  }

  return items;
}

type Props = {
  /**
   * Page content element to extract the TOC tree from
   */
  content: HTMLElement;
  /**
   * Page context used to display related guides
   */
  pageContext: PageContext;
};

function recursiveRender(items: TocItem[]) {
  return items.map(i => {
    if (!i.title) {
      return recursiveRender(i.items);
    }
    return (
      <li className="toc-entry" key={i.id}>
        <a href={`#${i.id}`}>{i.title}</a>
        {i.items && <ul>{recursiveRender(i.items)}</ul>}
      </li>
    );
  });
}

export function TableOfContents({content, pageContext}: Props) {
  const {platform} = pageContext;

  const items = useMemo(() => buildTocTree(getAnchorHeadings({content})), [content]);

  if (items.length === 0) {
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
