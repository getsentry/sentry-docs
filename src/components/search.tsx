import React, { useState, useEffect, useRef } from "react";

import Logo from "./logo";

import {
  SentryGlobalSearch,
  standardSDKSlug,
  Result,
} from "@sentry-internal/global-search";

import DOMPurify from "dompurify";

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
        })
        .then((results: Result[]) => {
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
                          {hits.map(hit => (
                            <li key={hit.id} className="sgs-hit-item">
                              <a href={hit.url}>
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
