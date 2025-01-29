'use client';

import {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {Button} from '@radix-ui/themes';
import {captureException} from '@sentry/nextjs';
import {
  Hit,
  Result,
  SentryGlobalSearch,
  standardSDKSlug,
} from '@sentry-internal/global-search';
import {usePathname} from 'next/navigation';
import algoliaInsights from 'search-insights';

import {useOnClickOutside} from 'sentry-docs/clientUtils';
import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';

import styles from './search.module.scss';

import {Logo} from '../logo';

import {SearchResultItems} from './searchResultItems';
import {relativizeUrl} from './util';

// Initialize Algolia Insights
algoliaInsights('init', {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  apiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
});

// We dont want to track anyone cross page/sessions or use cookies
// so just generate a random token each time the page is loaded and
// treat it as a random user.
const randomUserToken = crypto.randomUUID();

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
            <Button
              asChild
              variant="ghost"
              color="gray"
              size="3"
              radius="medium"
              className="font-medium text-[var(--foreground)] py-2 px-3 uppercase cursor-pointer kapa-ai-class hidden md:flex"
            >
              <div>
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
              </div>
            </Button>
          </Fragment>
        )}
      </div>
      {query.length >= 2 && inputFocus && (
        <div className={styles['sgs-search-results']}>
          {loading && <Logo loading />}

          {!loading && totalHits > 0 && (
            <SearchResultItems
              results={results}
              onSearchResultClick={({event, hit, position}) =>
                handleSearchResultClick(event, hit, position)
              }
              showOffsiteResults={showOffsiteResults}
            />
          )}

          {!loading && totalHits === 0 && (
            <div className={styles['sgs-hit-empty-state']}>
              <button className="kapa-ai-class font-bold">
                Can't find what you're looking for? Ask our AI!
              </button>
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

// const exampleDocsHit = {
//   id: 'f2274542a8fefa5e95bae958c36b97bd',
//   site: 'docs',
//   url: 'https://docs.sentry.io/platforms/javascript/guides/koa/troubleshooting/',
//   index: 'sentry-docs-v2',
//   context: {
//     context1: 'Platforms > JavaScript > Guides > Koa > Troubleshooting',
//   },
//   title: 'Troubleshooting',
//   text: 'If you need additional help, you can ask on GitHub . Customers on a paid plan …',
//   queryID: '021f95330896bc64cb93b22741badb26',
// };

// const platformsByTraffic = [
//   'nextjs',
//   'react',
//   'react-native',
//   'python',
//   'laravel',
//   'node',
//   'vue',
//   'ios',
//   'angular',
//   'nestjs',
//   'django',
//   'spring',
//   'go',
//   'ruby',
//   'kotlin',
//   'dart',
//   'unity',
// ];

// function sortPlatforms(hits: Hit[]) {
//   console.log('👉 unsorted hits', hits);

//   const getPlatform = (hit: Hit) => {
//     const url = new URL(hit.url);
//     const pathname = url.pathname.slice(1);
//     let sdkOrFramework: string | undefined;
//     if (pathname.includes('/guides/')) {
//       sdkOrFramework = pathname.split('/')[3];
//     } else if (pathname.includes('platforms/')) {
//       sdkOrFramework = pathname.split('/')[1];
//     }
//     return sdkOrFramework;
//   };

//   const hitsWithPlatform = hits.map(h => ({...h, platform: getPlatform(h)}));

//   const nonPlatformHits = hitsWithPlatform.filter(hit => !hit.platform);
//   const platformHits = hitsWithPlatform.filter(hit => !!hit.platform);

//   const sortedPlatformHits = platformHits.slice().sort((a, b) => {
//     const aPlatform = a.platform ?? '';
//     const bPlatform = b.platform ?? '';
//     // some platforms are missing, we should prioritize the ones in the platformsByTraffic array
//     const aIndex = platformsByTraffic.indexOf(aPlatform);
//     const bIndex = platformsByTraffic.indexOf(bPlatform);
//     debugger;
//     let tie = 0;
//     if (aIndex === -1 && bIndex !== -1) {
//       tie = -1;
//     }
//     if (bIndex === -1 && aIndex !== -1) {
//       tie = 1;
//     }
//     // smaller index has more weight
//     const diff = bIndex - aIndex;
//     tie = diff < 0 ? -1 : diff > 0 ? 1 : 0;
//     console.log('👉 comparing', a.platform, b.platform, 'diff', diff, 'tie', tie);
//     return tie;
//   });
//   console.log('👉 sorted hits', sortedPlatformHits.concat(nonPlatformHits));
//   return sortedPlatformHits;
// }
