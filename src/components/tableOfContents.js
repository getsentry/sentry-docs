import React from "react";

export default ({ toc: { items } }) => {
  if (!items) return null;

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
  return <ul className="section-nav">{recurse(items)}</ul>;
};
