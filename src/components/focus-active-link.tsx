'use client';
import {useEffect} from 'react';

type Props = {
  activeLinkSelector: string;
};

const STORAGE_KEY = 'sidebar-scroll-top';

// Helper to find the actual scrollable container
function findScrollContainer(element: Element): Element | null {
  let current: Element | null = element;
  while (current) {
    const {overflow, overflowY} = window.getComputedStyle(current);
    if (
      (overflow === 'auto' ||
        overflow === 'scroll' ||
        overflowY === 'auto' ||
        overflowY === 'scroll') &&
      current.scrollHeight > current.clientHeight
    ) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

/** Make sure the active link is visible in the sidebar */
export function ScrollActiveLink({activeLinkSelector}: Props) {
  // Register click handler to save the scroll container's scrollTop before navigation
  useEffect(() => {
    const firstLink = document.querySelector('[data-sidebar-link]');
    if (!firstLink) {
      return undefined;
    }

    const scrollContainer = findScrollContainer(firstLink);
    if (!scrollContainer) {
      return undefined;
    }

    const onLinkClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-sidebar-link]')) {
        sessionStorage.setItem(STORAGE_KEY, scrollContainer.scrollTop.toString());
      }
    };
    scrollContainer.addEventListener('click', onLinkClick);
    return () => {
      scrollContainer.removeEventListener('click', onLinkClick);
    };
  }, []);

  // Restore scroll position after navigation
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is fully rendered
    const timeoutId = requestAnimationFrame(() => {
      const activeLink = document.querySelector(activeLinkSelector);
      if (!activeLink) {
        return;
      }

      // Find the actual scrollable container (could be .toc, .sidebar, or another element)
      const scrollContainer = findScrollContainer(activeLink);
      if (!scrollContainer) {
        return;
      }

      const storedScrollTop = sessionStorage.getItem(STORAGE_KEY);

      if (storedScrollTop !== null) {
        scrollContainer.scrollTo(0, +storedScrollTop);
        sessionStorage.removeItem(STORAGE_KEY);
      } else {
        // No stored position (direct navigation, refresh, etc.) - scroll active link into view
        // Calculate the scroll position to center the active link in the scroll container
        const containerRect = scrollContainer.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        const containerCenter = containerRect.height / 2;
        const linkCenter = linkRect.height / 2;
        const scrollY =
          scrollContainer.scrollTop +
          (linkRect.top - containerRect.top) -
          containerCenter +
          linkCenter;
        scrollContainer.scrollTo({
          top: scrollY,
          behavior: 'auto',
        });
      }
    });

    return () => cancelAnimationFrame(timeoutId);
  }, [activeLinkSelector]);
  // don't render anything, just exist as a client-side component for the useEffect.
  return null;
}
