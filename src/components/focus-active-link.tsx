'use client';
import {useEffect} from 'react';

type Props = {
  activeLinkSelector: string;
};

function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/** Find the scrollable parent element */
function getScrollableParent(element: Element | null): Element | null {
  if (!element) return null;
  
  let parent = element.parentElement;
  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}

/** Make sure the active link is visible in the sidebar */
export function ScrollActiveLink({activeLinkSelector}: Props) {
  useEffect(() => {
    const sidebarLink = document.querySelector('[data-sidebar-link]');
    const scrollContainer = getScrollableParent(sidebarLink);
    if (!scrollContainer) {
      const noOp = () => {};
      return noOp;
    }
    const onLinkClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.hasAttribute('data-sidebar-link') || target.closest('[data-sidebar-link]')) {
        const link = target.hasAttribute('data-sidebar-link') ? target : target.closest('[data-sidebar-link]');
        if (link) {
          const top = link.getBoundingClientRect().top;
          sessionStorage.setItem('sidebar-link-position', top.toString());
        }
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
    const activeLink = document.querySelector(activeLinkSelector) as HTMLElement | null;
    if (!activeLink) {
      return;
    }
    
    const scrollContainer = getScrollableParent(activeLink);
    if (!scrollContainer) {
      return;
    }

    const previousBoundingRectTop = sessionStorage.getItem('sidebar-link-position');
    const currentBoundingRectTop = activeLink.getBoundingClientRect().top;
    
    // If we have a previous position, try to maintain the same visual position
    if (previousBoundingRectTop) {
      const scrollX = 0;
      const scrollY = scrollContainer.scrollTop + currentBoundingRectTop - +previousBoundingRectTop;
      scrollContainer.scrollTo(scrollX, scrollY);
    } else {
      // No previous position - scroll the active link into view (centered in sidebar)
      activeLink.scrollIntoView({block: 'center', behavior: 'instant'});
    }
  }, [activeLinkSelector]);
  // don't render anything, just exist as a client-side component for the useEffect.
  return null;
}
