import React from "react";

type _Item<T> = {
  title?: string;
  url?: string;
  items: T[];
};

interface Item extends _Item<Item> {}

type Props = {
  toc: {
    items: Item;
  };
};

export default ({ toc: { items } }: Props) => {
  if (!items) return null;

  const recurse = items =>
    items.map(i => {
      // The title is included the explicit anchor name when present. So lets strip it.
      // e.g. My Title {#my-title}
      if (!i.title) return recurse(i.items);
      return (
        <li className="toc-entry" key={i.url}>
          <a href={i.url}>{i.title.replace(/\s\{#[^}]+\}$/, "")}</a>
          {i.items && <ul>{recurse(i.items)}</ul>}
        </li>
      );
    });
  return <ul className="section-nav">{recurse(items)}</ul>;
};
