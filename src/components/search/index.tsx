'use client';

import {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {captureException} from '@sentry/nextjs';
import {
  Hit,
  Result,
  SentryGlobalSearch,
  standardSDKSlug,
} from '@sentry-internal/global-search';
import DOMPurify from 'dompurify';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import algoliaInsights from 'search-insights';

import {useOnClickOutside} from 'sentry-docs/clientUtils';
import {useKeyboardNavigate} from 'sentry-docs/hooks/useKeyboardNavigate';
import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';

import styles from './search.module.scss';

import {Logo} from '../logo';
import {NavLink} from '../navlink';

// Initialize Algolia Insights
algoliaInsights('init', {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  apiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
});

// We dont want to track anyone cross page/sessions or use cookies
// so just generate a random token each time the page is loaded and
// treat it as a random user.
const randomUserToken = crypto.randomUUID();

const MAX_HITS = 10;

// this type is not exported from the global-search package
type SentryGlobalSearchConfig = ConstructorParameters<typeof SentryGlobalSearch>[0];

const developerDocsSites: SentryGlobalSearchConfig = [
  'develop',
  'zendesk_sentry_articles',
  'docs',
  'blog',
];

const userDocsSites: SentryGlobalSearchConfig = [
  {
    site: 'docs',
    pathBias: true,
    platformBias: true,
    legacyBias: true,
  },
  'zendesk_sentry_articles',
  'develop',
  'blog',
];
const config = isDeveloperDocs ? developerDocsSites : userDocsSites;
const search = new SentryGlobalSearch(config);

function relativizeUrl(url: string) {
  return isDeveloperDocs
    ? url
    : url.replace(/^(https?:\/\/docs\.sentry\.io)(?=\/|$)/, '');
}

type Props = {
  autoFocus?: boolean;
  path?: string;
  searchPlatforms?: string[];
  showChatBot?: boolean;
};

export function Search({path, autoFocus, searchPlatforms = [], showChatBot}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(``);
  const [results, setResults] = useState([] as Result[]);
  const [inputFocus, setInputFocus] = useState(false);
  const [showOffsiteResults, setShowOffsiteResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const handleClickOutside = useCallback((ev: MouseEvent) => {
    // don't close the search results if the user is clicking the expand button
    if (
      (ev.target as HTMLButtonElement).classList.contains(
        styles['sgs-expand-results-button']
      )
    ) {
      return;
    }

    setInputFocus(false);
    setShowOffsiteResults(false);
  }, []);

  useOnClickOutside({ref, handler: handleClickOutside});

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
    // setup Cmd/Ctrl+K to focus the search input
    const handleCmdK = (ev: KeyboardEvent) => {
      if (ev.key === 'k' && (ev.metaKey || ev.ctrlKey)) {
        ev.preventDefault();
        inputRef.current?.focus();
        setInputFocus(true);
      }
    };
    // set up esc to clear the search query and blur the search input if it's empty
    const handleEsc = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        if (inputRef.current?.value) {
          setQuery('');
          return;
        }
        setInputFocus(false);
        setShowOffsiteResults(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleCmdK);
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleCmdK);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [autoFocus]);

  const searchFor = useCallback(
    async (inputQuery: string, args: Parameters<typeof search.query>[1] = {}) => {
      setQuery(inputQuery);
      if (inputQuery.length === 2) {
        setShowOffsiteResults(false);
        setResults([]);
        return;
      }

      // Only search when we have more than two characters. Ideally we'd do three, but
      // we want to make sure people can search for Go and RQ
      if (inputQuery.length < 2) {
        return;
      }

      const queryResults = await search.query(
        inputQuery,
        {
          path,
          platforms: searchPlatforms.map(
            platform => standardSDKSlug(platform)?.slug ?? ''
          ),
          searchAllIndexes: showOffsiteResults,
          ...args,
        },
        {clickAnalytics: true, analyticsTags: ['source:documentation']}
      );

      if (loading) {
        setLoading(false);
      }

      if (queryResults.length === 1 && queryResults[0].hits.length === 0) {
        setShowOffsiteResults(true);
        searchFor(inputQuery, {searchAllIndexes: true});
      } else {
        setResults(queryResults);
      }
    },
    [path, searchPlatforms, showOffsiteResults, loading]
  );

  const totalHits = results.reduce((a, x) => a + x.hits.length, 0);

  const flatHits = results.reduce<Hit[]>(
    (items, item) => [...items, ...item.hits.slice(0, MAX_HITS)],
    []
  );

  const {focused} = useKeyboardNavigate({
    list: flatHits,
    onSelect: hit => router.push(relativizeUrl(hit.url)),
  });

  const trackSearchResultClick = useCallback((hit: Hit, position: number): void => {
    try {
      algoliaInsights('clickedObjectIDsAfterSearch', {
        eventName: 'documentation_search_result_click',
        userToken: randomUserToken,
        index: hit.index,
        objectIDs: [hit.id],
        // Positions in Algolia are 1 indexed
        queryID: hit.queryID ?? '',
        positions: [position + 1],
      });
    } catch (error) {
      captureException(error);
    }
  }, []);

  const removeTags = useCallback((str: string) => {
    return str.replace(/<\/?[^>]+(>|$)/g, '');
  }, []);

  const handleSearchResultClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, hit: Hit, position: number): void => {
      if (hit.id === undefined) {
        return;
      }

      trackSearchResultClick(hit, position);

      // edge case when the clicked search result is the currently visited paged
      if (relativizeUrl(hit.url) === pathname) {
        // do not navigate to the search result page in this case
        event.preventDefault();

        // sanitize the title to remove any html tags
        const title = hit?.title && removeTags(hit.title);

        if (!title) {
          return;
        }

        // check for heading with the same text as the title
        const headings =
          document
            .querySelector('main > div.prose')
            ?.querySelectorAll('h1, h2, h3, h4, h5, h6') ?? [];
        const foundHeading = Array.from(headings).find(heading =>
          heading.textContent?.toLowerCase().includes(title.toLowerCase())
        );

        // close the search results and scroll to the heading if it exists
        setInputFocus(false);
        if (foundHeading) {
          foundHeading.scrollIntoView({
            behavior: 'smooth',
          });
        }
      }
    },
    [pathname, removeTags, trackSearchResultClick]
  );

  return (
    <div className={styles.search} ref={ref}>
      <div className={styles['search-bar']}>
        <div className={styles['input-wrapper']}>
          <input
            type="text"
            placeholder="Search Docs"
            aria-label="Search"
            className={styles['search-input']}
            value={query}
            onChange={({target: {value}}) => searchFor(value)}
            onFocus={() => setInputFocus(true)}
            ref={inputRef}
            onKeyDown={ev => {
              ev.stopPropagation();
            }}
          />
          <kbd className={styles['search-hotkey']} data-focused={inputFocus}>
            {inputFocus ? 'esc' : '⌘K'}
          </kbd>
        </div>
        {showChatBot && (
          <Fragment>
            <span className="text-[var(--desatPurple10)] hidden md:inline">or</span>
            <NavLink
              href="https://docsbot.ai/chat/skFEy0qDC01GrRrZ7Crs/EPqsd8nu2XmKzWnd45tL"
              target="_blank"
              style={{textWrap: 'nowrap'}}
              className="hidden md:flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                />
              </svg>
              <span>Ask AI</span>
            </NavLink>
          </Fragment>
        )}
      </div>
      {query.length >= 2 && inputFocus && (
        <div className={styles['sgs-search-results']}>
          {loading && <Logo loading />}

          {!loading && totalHits > 0 && (
            <div className={styles['sgs-search-results-scroll-container']}>
              {results
                .filter(x => x.hits.length > 0)
                .map((result, i) => (
                  <Fragment key={result.site}>
                    {showOffsiteResults && (
                      <h4 className={styles['sgs-site-result-heading']}>
                        From {result.name}
                      </h4>
                    )}
                    <ul
                      className={`${styles['sgs-hit-list']} ${i === 0 ? '' : styles['sgs-offsite']}`}
                    >
                      {result.hits.slice(0, MAX_HITS).map((hit, index) => (
                        <li
                          key={hit.id}
                          className={`${styles['sgs-hit-item']} ${
                            focused?.id === hit.id ? styles['sgs-hit-focused'] : ''
                          }`}
                          ref={
                            // Scroll to element on focus
                            hit.id === focused?.id
                              ? el => el?.scrollIntoView({block: 'nearest'})
                              : undefined
                          }
                        >
                          <Link
                            href={relativizeUrl(hit.url)}
                            onClick={e => handleSearchResultClick(e, hit, index)}
                          >
                            {hit.title && (
                              <h6>
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(hit.title, {
                                      ALLOWED_TAGS: ['mark'],
                                    }),
                                  }}
                                />
                              </h6>
                            )}
                            {hit.text && (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(hit.text, {
                                    ALLOWED_TAGS: ['mark'],
                                  }),
                                }}
                              />
                            )}
                            {hit.context && (
                              <div className={styles['sgs-hit-context']}>
                                {hit.context.context1 && (
                                  <div className={styles['sgs-hit-context-left']}>
                                    {hit.context.context1}
                                  </div>
                                )}
                                {hit.context.context2 && (
                                  <div className={styles['sgs-hit-context-right']}>
                                    {hit.context.context2}
                                  </div>
                                )}
                              </div>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Fragment>
                ))}
            </div>
          )}

          {!loading && totalHits === 0 && (
            <div className={styles['sgs-hit-empty-state']}>
              No results for <em>{query}</em>
            </div>
          )}

          {!loading && !showOffsiteResults && (
            <div className={styles['sgs-expand-results']}>
              <button
                className={styles['sgs-expand-results-button']}
                onClick={() => setShowOffsiteResults(true)}
                onMouseOver={() => searchFor(query, {searchAllIndexes: true})}
              >
                Search <em>{query}</em> across all Sentry sites
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
