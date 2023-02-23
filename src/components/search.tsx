import React, { useState, useEffect, useRef, useCallback } from "react";
import algoliaInsights from 'search-insights';

import Logo from "./logo";

import {
  SentryGlobalSearch,
  standardSDKSlug,
  Result,
  Hit,
} from "@sentry-internal/global-search";

import DOMPurify from "dompurify";

// https://stackoverflow.com/a/2117523/115146
function uuidv4(){
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

// Initialize Algolia Insights
algoliaInsights('init', {
  appId: 'OOK48W9UCL',
  apiKey: '2d64ec1106519cbc672d863b0d200782',
})

// We dont want to track anyone cross page/sessions or use cookies
// so just generate a random token each time the page is loaded and
// treat it as a random user.
const randomUserToken = uuidv4()

const MAX_HITS = 10;

const search = new SentryGlobalSearch([
  {
    site: "docs",
    pathBias: true,
  },
  "help-center",
  "develop",
  "blog",
]);

const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: () => void,
  events?: string[]
) => {
  if (!events) events = [`mousedown`, `touchstart`];

  const detectClickOutside = (event: MouseEvent) => {
    return !ref.current.contains(event.target as HTMLElement) && handler();
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

type Props = {
  path?: string;
  platforms?: string[];
};

export default ({ path, platforms = [] }: Props): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(``);
  const [results, setResults] = useState([] as Result[]);
  const [focus, setFocus] = useState(false);
  const [showOffsiteResults, setShowOffsiteResults] = useState(false);
  const [loading, setLoading] = useState(true);
  useClickOutside(ref, () => {
    setFocus(false);
    setShowOffsiteResults(false);
  });

  const searchFor = (query, args = {}) => {
    setQuery(query);

    if (query.length >= 2) {
      // Only search when we have more than two characters. Ideally we'd do three, but
      // we want to make sure people can search for Go and RQ
      search
        .query(query, {
          path,
          platforms: platforms.map(platform => standardSDKSlug(platform).slug),
          searchAllIndexes: showOffsiteResults,
          ...args,
        }, {clickAnalytics: true})
        .then((results: Result[], ) => {
          if (loading) setLoading(false);

          if (results.length === 1 && results[0].hits.length === 0) {
            setShowOffsiteResults(true);
            searchFor(query, { searchAllIndexes: true });
          } else {
            setResults(results);
          }
        });
    } else if (query.length === 0) {
      // If the user cleared the query, reset everything.
      setShowOffsiteResults(false);
      setResults([]);
    }
  };

  const totalHits = results.reduce((a, x) => a + x.hits.length, 0);

  const trackSearchResultClick = useCallback((hit: Hit, position: number): void => {
    if(hit.id === undefined){
      return
    }

    algoliaInsights("clickedObjectIDsAfterSearch", {
      eventName: "documentation_search_result_click",
      userToken: randomUserToken,
      index: hit.index,
      objectIDs: [hit.id],
      // Positions in Algolia are 1 indexed
      queryID:  hit.queryID,
      positions: [position + 1]
    })
  },[])

  return (
    <div ref={ref}>
      <input
        type="search"
        placeholder="Search"
        aria-label="Search"
        className="form-control"
        onChange={({ target: { value: query } }) => {
          searchFor(query);
        }}
        value={query}
        onFocus={() => setFocus(true)}
      />

      {query.length >= 2 && focus && (
        <div className="sgs-search-results">
          {loading && <Logo loading={true} />}

          {!loading && totalHits > 0 && (
            <>
              <div className="sgs-search-results-scroll-container">
                {results
                  .filter(x => x.hits.length > 0)
                  .map((result, i) => {
                    const hits = result.hits.slice(0, MAX_HITS);

                    return (
                      <React.Fragment key={result.site}>
                        {showOffsiteResults && (
                          <h4 className="sgs-site-result-heading">
                            From {result.name}
                          </h4>
                        )}
                        <ul
                          className={`sgs-hit-list ${
                            i === 0 ? "" : "sgs-offsite"
                          }`}
                        >
                          {hits.map((hit, index) => (
                            <li key={hit.id} className="sgs-hit-item">
                              <a href={hit.url} onClick={() => trackSearchResultClick(hit, index)}>
                                {hit.title && (
                                  <h6>
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(hit.title, {
                                          ALLOWED_TAGS: ["mark"],
                                        }),
                                      }}
                                    ></span>
                                  </h6>
                                )}
                                {hit.text && (
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: DOMPurify.sanitize(hit.text, {
                                        ALLOWED_TAGS: ["mark"],
                                      }),
                                    }}
                                  />
                                )}
                                {hit.context && (
                                  <div className="sgs-hit-context">
                                    {hit.context.context1 && (
                                      <div className="sgs-hit-context-left">
                                        {hit.context.context1}
                                      </div>
                                    )}
                                    {hit.context.context2 && (
                                      <div className="sgs-hit-context-right">
                                        {hit.context.context2}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </React.Fragment>
                    );
                  })}
              </div>
            </>
          )}

          {!loading && totalHits === 0 && (
            <div className="sgs-hit-empty-state">
              No results for <em>{query}</em>
            </div>
          )}

          {!loading && !showOffsiteResults && (
            <div className="sgs-expand-results">
              <button
                className="sgs-expand-results-button"
                onClick={() => setShowOffsiteResults(true)}
                onMouseOver={() => searchFor(query, { searchAllIndexes: true })}
              >
                Search <em>{query}</em> across all Sentry sites
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
