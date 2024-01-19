import Link from "next/link";
import { GuideGrid } from "./guideGrid";

interface TocItem {
  value: string;
  url: string;
  depth: number;
  children?: TocItem[];
}

interface Props {
  toc: TocItem[];
}

function recursiveRender(items: TocItem[]) {
  return items.map(i => {
    if (!i.value) {
      return recursiveRender(i.children || []);
    }
    return (
      <li className="toc-entry" key={i.url}>
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

export function TableOfContents({toc}: Props) {
  if (toc.length === 0) {
    return (
      <div className="doc-toc">
        <GuideGrid className="section-nav" />
      </div>
    );
  }

  const items = buildTocTree(toc);

  return (
    <div className="doc-toc">
      <div className="doc-toc-title">
        <h6>On this page</h6>
      </div>
      <ul className="section-nav">{recursiveRender(items)}</ul>
    </div>
  );
}
