'use client';
import {useEffect} from 'react';

import {debounce} from 'sentry-docs/utils';

type Props = {
  activeLinkSelector: string;
};

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
      if (target.hasAttribute('data-sidebar-link')) {
        const top = target.getBoundingClientRect().top;
        sessionStorage.setItem('sidebar-link-position', top.toString());
      }
    };
    scrollContainer.addEventListener('click', onLinkClick);
    // track active link position on scroll as well
    const onSidebarScroll = debounce(() => {
      const activeLink = document.querySelector(activeLinkSelector);
      if (activeLink) {
        const top = activeLink.getBoundingClientRect().top.toString();
        sessionStorage.setItem('sidebar-link-position', top);
      }
    }, 50);

    scrollContainer.addEventListener('scroll', onSidebarScroll);
    return () => {
      scrollContainer.removeEventListener('click', onLinkClick);
      scrollContainer.removeEventListener('scroll', onSidebarScroll);
    };
  }, [activeLinkSelector]);

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

      const previousBoundingRectTop = sessionStorage.getItem('sidebar-link-position');
      const currentBoundingRectTop = activeLink.getBoundingClientRect().top;

      // If we have a stored position, restore it to maintain the same visual position
      if (previousBoundingRectTop) {
        const scrollX = 0;
        const scrollY =
          scrollContainer.scrollTop + currentBoundingRectTop - +previousBoundingRectTop;
        scrollContainer.scrollTo(scrollX, scrollY);
      } else {
        // No stored position (direct navigation, refresh, etc.) - scroll active link into view
        // Calculate the scroll position to center the active link in the scroll container
        const containerRect = scrollContainer.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        const containerCenter = containerRect.height / 2;
        const linkCenter = linkRect.height / 2;
        const scrollY =
          scrollContainer.scrollTop + (linkRect.top - containerRect.top) - containerCenter + linkCenter;
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
