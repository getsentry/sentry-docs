'use client';

import {useEffect} from 'react';

/**
 * Fixes browser Back/Forward after a same-page hash navigation.
 *
 * A plain `<a href="#section">` triggers a native fragment navigation, which
 * the browser records with `history.state = null`. Next's App Router ignores
 * `popstate` for such state-less entries, so navigating Back to a hash URL
 * leaves the previous page rendered while only the URL changes. Copying the
 * page's own router state onto the new entry lets Next treat it like any other.
 */
export function HashNavigation() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const href = (event.target as HTMLElement | null)
        ?.closest?.('a')
        ?.getAttribute('href');
      if (!href?.startsWith('#')) {
        return;
      }
      // Capture the current (valid) state before the browser creates the
      // state-less fragment entry, then restore it onto that entry. The
      // `=== null` check is what keeps this safe: it only fires for a real
      // fragment navigation, never for modified clicks, new tabs, or router
      // navigations (which all leave a non-null state).
      const routerState = window.history.state;
      requestAnimationFrame(() => {
        if (routerState && window.history.state === null) {
          window.history.replaceState(routerState, '', window.location.href);
        }
      });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
