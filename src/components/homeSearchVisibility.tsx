'use client';

import {useEffect, useRef} from 'react';

// Custom event to communicate search visibility across components
const SEARCH_VISIBILITY_EVENT = 'home-search-visibility';

export function useHomeSearchVisible() {
  // This hook is used by the header to know if home search is visible
  if (typeof window === 'undefined') {
    return true; // SSR default
  }
  return (window as any).__homeSearchVisible ?? true;
}

export function HomeSearchObserver({children}: {children: React.ReactNode}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        (window as any).__homeSearchVisible = isVisible;
        window.dispatchEvent(
          new CustomEvent(SEARCH_VISIBILITY_EVENT, {detail: {isVisible}})
        );
      },
      {
        threshold: 0,
        rootMargin: '-64px 0px 0px 0px', // Account for header height
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{children}</div>;
}

export function useHomeSearchVisibility(callback: (isVisible: boolean) => void) {
  useEffect(() => {
    const handler = (e: CustomEvent<{isVisible: boolean}>) => {
      callback(e.detail.isVisible);
    };

    window.addEventListener(SEARCH_VISIBILITY_EVENT as any, handler as EventListener);
    return () => {
      window.removeEventListener(
        SEARCH_VISIBILITY_EVENT as any,
        handler as EventListener
      );
    };
  }, [callback]);
}
