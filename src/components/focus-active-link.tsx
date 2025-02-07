'use client';
import {useEffect} from 'react';

import {debounce} from 'sentry-docs/utils';

type Props = {
  activeLinkSelector: string;
};

/** Make sure the active link is visible in the sidebar */
export function ScrollActiveLink({activeLinkSelector}: Props) {
  useEffect(() => {
    const sidebar = document.querySelector('[data-sidebar-link]')?.closest('aside');
    if (!sidebar) {
      const noOp = () => {};
      return noOp;
    }
    const onLinkClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.hasAttribute('data-sidebar-link')) {
        const top = target.getBoundingClientRect().top;
        sessionStorage.setItem('sidebar-link-poisition', top.toString());
      }
    };
    sidebar.addEventListener('click', onLinkClick);
    // track active link position on scroll as well
    const onSidebarSroll = debounce(() => {
      const activeLink = document.querySelector(activeLinkSelector);
      if (activeLink) {
        const top = activeLink.getBoundingClientRect().top.toString();
        sessionStorage.setItem('sidebar-link-poisition', top);
      }
    }, 50);

    sidebar.addEventListener('scroll', onSidebarSroll);
    return () => {
      sidebar.removeEventListener('click', onLinkClick);
      sidebar.removeEventListener('scroll', onSidebarSroll);
    };
  }, [activeLinkSelector]);

  useEffect(() => {
    const activeLink = document.querySelector(activeLinkSelector);
    const sidebar = activeLink?.closest('aside')!;
    if (!activeLink || !sidebar) {
      return;
    }
    const previousBoundingRectTop = sessionStorage.getItem('sidebar-link-poisition');
    const currentBoundingRectTop = activeLink.getBoundingClientRect().top;
    // scroll the sidebar to make sure the active link is visible & has the same position as when it was clicked
    if (!previousBoundingRectTop) {
      return;
    }
    const scrollX = 0;
    const scrollY = sidebar.scrollTop + currentBoundingRectTop - +previousBoundingRectTop;
    sidebar?.scrollTo(scrollX, scrollY);
  }, [activeLinkSelector]);
  // don't render anything, just exist as a client-side component for the useEffect.
  return null;
}
