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
      activeLink.scrollIntoView({block: 'nearest'});
    }
  }, [activeLinkSelector]);
  // don't render anything, just exist as a client-side component for the useEffect.
  return null;
}
