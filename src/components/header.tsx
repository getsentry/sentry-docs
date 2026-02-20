'use client';

import {useCallback, useState} from 'react';
import {HamburgerMenuIcon} from '@radix-ui/react-icons';
import {Button} from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

import SentryLogoSVG from 'sentry-docs/logos/sentry-logo-dark.svg';
import {Platform} from 'sentry-docs/types';

import sidebarStyles from './sidebar/style.module.scss';

import {MagicIcon} from './cutomIcons/magic';
import {useHomeSearchVisibility} from './homeSearchVisibility';
import {ThemeToggle} from './theme-toggle';
import TopNavClient from './TopNavClient';

// Lazy load Search to reduce initial bundle size.
// Search includes Algolia and @sentry-internal/global-search which add significant JS.
// Using ssr:false since search is interactive-only and not needed for initial paint.
// Fixes: DOCS-8BT (Large Render Blocking Asset)
const Search = dynamic(() => import('./search').then(mod => ({default: mod.Search})), {
  ssr: false,
  loading: () => (
    <div className="h-10 w-full max-w-md rounded-lg border border-[var(--gray-a5)] bg-[var(--gray-2)] animate-pulse" />
  ),
});

export const sidebarToggleId = sidebarStyles['navbar-menu-toggle'];

type Props = {
  pathname: string;
  searchPlatforms: string[];
  noSearch?: boolean;
  platforms?: Platform[];
  useStoredSearchPlatforms?: boolean;
};

export default function Header({
  pathname,
  searchPlatforms,
  noSearch,
  useStoredSearchPlatforms,
  platforms = [],
}: Props) {
  const isHomePage = pathname === '/';
  const [homeSearchVisible, setHomeSearchVisible] = useState(true);

  // Listen for home search visibility changes
  useHomeSearchVisibility(
    useCallback((isVisible: boolean) => {
      setHomeSearchVisible(isVisible);
    }, [])
  );

  // Show header search if: not on home page, OR on home page but home search is scrolled out of view
  const showHeaderSearch = !isHomePage || !homeSearchVisible;

  return (
    <header className="bg-[var(--gray-1)] h-[var(--header-height)] w-full z-50 border-b border-[var(--gray-a3)] fixed top-0">
      {/* define a header-height variable for consumption by other components */}
      <style>{':root { --header-height: 64px; }'}</style>
      <nav className="nav-inner mx-auto px-4 lg:px-8 flex items-center gap-4 min-h-[64px]">
        {pathname !== '/' && (
          <button className="lg-xl:hidden mr-3">
            <label
              htmlFor={sidebarToggleId}
              aria-label="Close"
              aria-hidden="true"
              className="inline-flex items-center cursor-pointer"
            >
              <HamburgerMenuIcon
                className="inline dark:text-[var(--foreground)] text-[var(--gray-10)]"
                strokeWidth="1.8"
                width="22"
                height="22"
              />
            </label>
          </button>
        )}
        <Link
          href="/"
          title="Sentry error monitoring"
          className="logo-slot flex flex-shrink-0 items-center text-lg font-medium text-[var(--foreground)] mr-4"
          style={{minWidth: 0}}
        >
          <div className="h-full pb-[2px] mr-2">
            <Image
              src={SentryLogoSVG}
              alt="Sentry's logo"
              width={28}
              className="h-10 dark:invert"
            />
          </div>
          <span className="text-base font-semibold tracking-tight">Docs</span>
        </Link>
        {!noSearch && showHeaderSearch && (
          <div className="hidden sm:flex flex-shrink-0 items-center gap-2 mr-4">
            <Search
              path={pathname}
              searchPlatforms={searchPlatforms}
              showChatBot
              useStoredSearchPlatforms={useStoredSearchPlatforms}
            />
          </div>
        )}
        <div className="flex-1 min-w-0 flex items-center gap-4">
          <div className="hidden sm:block flex-1 min-w-0">
            <TopNavClient platforms={platforms} />
          </div>
          {!noSearch && (
            <div
              className="hidden sm:flex flex-shrink-0 items-center gap-4"
              style={{marginLeft: '15px'}}
            >
              <Button
                asChild
                variant="ghost"
                color="gray"
                size="3"
                radius="medium"
                className="font-medium text-[var(--foreground)] py-2 px-3 uppercase cursor-pointer whitespace-nowrap"
              >
                <a href="https://sentry.io/" target="_blank" rel="noopener noreferrer">
                  Go to Sentry
                </a>
              </Button>
              <ThemeToggle />
            </div>
          )}
          {/* Mobile: show Ask AI button and theme toggle */}
          <div className="flex items-center sm:hidden ml-auto gap-3">
            <button
              className="kapa-ai-class flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)] px-2 py-1.5 rounded-md hover:bg-[var(--gray-a3)] transition-colors"
              aria-label="Ask AI"
            >
              <MagicIcon className="size-4" />
              <span className="uppercase text-xs">Ask AI</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>
      <style>{`
        /* Align header width with content + sidebars at wide screens */
        @media (min-width: 2057px) {
          header .nav-inner {
            /* total layout width = sidebar + gap + content + gap + toc */
            max-width: calc(
              var(--sidebar-width, 300px)
              + var(--gap, 24px)
              + var(--doc-content-w, 1200px)
              + var(--gap, 24px)
              + var(--toc-w, 250px)
            );
            margin-left: auto;
            margin-right: auto;
            /* center, then compensate if sidebar != toc */
            transform: translateX(calc((var(--toc-w, 250px) - var(--sidebar-width, 300px)) / 2));
            /* restore small internal padding (≈ Tailwind px-3) */
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          /* Ensure the left logo area equals sidebar width */
          header .nav-inner .logo-slot {
            width: var(--sidebar-width, 300px);
          }
        }
      `}</style>
    </header>
  );
}
