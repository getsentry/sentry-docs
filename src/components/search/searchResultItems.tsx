import {Fragment} from 'react';
import {Hit, Result} from '@sentry-internal/global-search';
import DOMPurify from 'dompurify';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {useListKeyboardNavigate} from 'sentry-docs/hooks/useListKeyboardNavigate';

import styles from './search.module.scss';

import {relativizeUrl} from './util';

const MAX_HITS = 10;

interface SearchResultClickHandler {
  event: React.MouseEvent<HTMLAnchorElement>;
  hit: Hit;
  position: number;
}

export function SearchResultItems({
  results,
  showOffsiteResults,
  onSearchResultClick,
}: {
  onSearchResultClick: (params: SearchResultClickHandler) => void;
  results: Result[];
  showOffsiteResults: boolean;
}) {
  const router = useRouter();
  const flatHits = results.reduce<Hit[]>(
    (items, item) => [...items, ...item.hits.slice(0, MAX_HITS)],
    []
  );
  const {focused} = useListKeyboardNavigate({
    list: flatHits,
    onSelect: hit => router.push(relativizeUrl(hit.url)),
  });

  return (
    <div className={styles['sgs-search-results-scroll-container']}>
      {results
        .filter(x => x.hits.length > 0)
        .map((result, i) => (
          <Fragment key={result.site}>
            {showOffsiteResults && (
              <h4 className={styles['sgs-site-result-heading']}>From {result.name}</h4>
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
                    onClick={event => onSearchResultClick({event, hit, position: index})}
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
  );
}
