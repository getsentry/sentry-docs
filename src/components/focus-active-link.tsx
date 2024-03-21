'use client';
import {useEffect} from 'react';

/** Make sure the active link is visible in the sidebar */
export function ScrollActiveLink() {
  const isVsibible = (link: Element) => {
    const rect = link.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
  };

  useEffect(() => {
    const activeLink = document.querySelector('.sidebar .toc .active');
    if (activeLink && !isVsibible(activeLink)) {
      // try to center the active link in the sidebar
      activeLink.scrollIntoView({block: 'center'});
    }
  }, []);
  // don't render anything, just exist as a client-side component for the useEffect
  return null;
}
