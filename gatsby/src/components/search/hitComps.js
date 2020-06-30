import React from "react";
import { Highlight, Snippet } from "react-instantsearch-dom";
import { Link } from "gatsby";

export const PageHit = (clickHandler) => ({ hit }) => {
  return (
    <Link to={hit.fields.slug} onClick={clickHandler}>
      <h6 className="mb-1">
        <Highlight attribute="title" hit={hit} tagName="mark" />
        {hit.categories && (
          <React.Fragment>
            {hit.categories.map((category) => (
              <span className="badge badge-secondary">{category}</span>
            ))}
          </React.Fragment>
        )}
      </h6>
      <Snippet attribute="excerpt" hit={hit} tagName="mark" />
    </Link>
  );
};
