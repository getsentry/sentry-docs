import React, { useState, useEffect, useRef } from "react";
import {
  InstantSearch,
  Index,
  Hits,
  connectStateResults,
} from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";

import Input from "./input";
import * as hitComps from "./hitComps";

const Results = connectStateResults(
  ({ searchState: state, searchResults: res, children }) =>
    res && res.nbHits > 0 ? (
      children
    ) : (
      <div className="list-group-item">No results for '{state.query}'</div>
    )
);

const useClickOutside = (ref, handler, events) => {
  if (!events) events = [`mousedown`, `touchstart`];

  const detectClickOutside = (event) => {
    return !ref.current.contains(event.target) && handler();
  };

  useEffect(() => {
    for (const event of events) {
      document.addEventListener(event, detectClickOutside);
    }

    return () => {
      for (const event of events) {
        document.removeEventListener(event, detectClickOutside);
      }
    };
  });
};

export default function Search({ indices, collapse, hitsAsGrid }) {
  const ref = useRef(null);
  const [query, setQuery] = useState(``);
  const [focus, setFocus] = useState(false);
  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY
  );

  useClickOutside(ref, () => setFocus(false));

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indices[0].name}
      onSearchStateChange={({ query }) => setQuery(query)}
    >
      <div ref={ref}>
        <Input onFocus={() => setFocus(true)} {...{ collapse, focus }} />
        <div
          style={{ display: query.length > 0 && focus ? "block" : "none" }}
          className="hits"
        >
          <div className="list-group search-results">
            {indices.map(({ name, title, hitComp, ...props }) => (
              <Index key={name} indexName={name}>
                <Results>
                  <Hits
                    hitComponent={hitComps[hitComp](() => setFocus(false))}
                  />
                </Results>
              </Index>
            ))}
          </div>
        </div>
      </div>
    </InstantSearch>
  );
}
