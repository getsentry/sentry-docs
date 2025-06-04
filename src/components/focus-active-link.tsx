'use client';
import {useEffect} from 'react';

type Props = {
  activeLinkSelector: string;
};

/** Make sure the active link is visible in the sidebar */
export function ScrollActiveLink({activeLinkSelector}: Props) {
  useEffect(() => {
    const activeLinks = Array.from(document.querySelectorAll(activeLinkSelector)) as HTMLElement[];
    const activeLink = activeLinks[activeLinks.length - 1];
    if (activeLink) {
      // Find the closest scrollable sidebar container
      const sidebarMain = activeLink.closest('.sidebar-main') as HTMLElement;
      if (sidebarMain) {
        const linkRect = activeLink.getBoundingClientRect();
        const containerRect = sidebarMain.getBoundingClientRect();
        const isFullyVisible =
          linkRect.top >= containerRect.top &&
          linkRect.bottom <= containerRect.bottom;
        if (!isFullyVisible) {
          activeLink.scrollIntoView({block: 'nearest'});
        }
      } else {
        // fallback: original behavior
        activeLink.scrollIntoView({block: 'nearest'});
      }
    }
  }, [activeLinkSelector]);
  // don't render anything, just exist as a client-side component for the useEffect.
  return null;
}
