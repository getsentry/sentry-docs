'use client';

import {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {ArrowRightIcon} from '@radix-ui/react-icons';
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

import {MagicIcon} from '../cutomIcons/magic';
import {Logo} from '../logo';

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
};

export function Search({path, autoFocus, searchPlatforms = []}: Props) {
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
      </div>
      {query.length >= 2 && inputFocus && (
        <div className={styles['sgs-search-results']}>
          <div className={styles['sgs-ai']}>
            <button
              id="ai-list-entry"
              className={`${styles['sgs-ai-button']} ${
                focused?.id === 'ai-list-entry' ? styles['sgs-ai-focused'] : ''
              }`}
              onClick={() => {
                if (window.Kapa?.open) {
                  // close search results
                  setInputFocus(false);
                  // open kapa modal
                  window.Kapa.open({query: `Explain ${query}`, submit: true});
                }
              }}
            >
              <MagicIcon className="size-6 text-[var(--sgs-color-hit-highlight)] flex-shrink-0" />
              <div className={styles['sgs-ai-button-content']}>
                <h6>
                  Ask Sentry about{' '}
                  <span>{query.length > 30 ? query.slice(0, 30) + '...' : query}</span>
                </h6>
                <div className={styles['sgs-ai-hint']}>
                  Get an AI-powered answer to your question
                </div>
              </div>
              <ArrowRightIcon className="size-5 text-[var(--sgs-color-hit-highlight)] ml-auto flex-shrink-0" />
            </button>
          </div>

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
