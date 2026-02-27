'use client';

import {useCallback, useEffect, useState} from 'react';
import {Cross1Icon, HamburgerMenuIcon} from '@radix-ui/react-icons';
import {Button} from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

import SentryLogoSVG from 'sentry-docs/logos/sentry-logo-dark.svg';
import {Platform} from 'sentry-docs/types';

import sidebarStyles from './sidebar/style.module.scss';

import {MagicIcon} from './cutomIcons/magic';
import {useHomeSearchVisibility} from './homeSearchVisibility';
import {mainSections} from './navigationData';
import {ThemeToggle} from './theme-toggle';
import TopNavClient from './TopNavClient';

// Lazy load Search to reduce initial bundle size.
// Search includes Algolia and @sentry-internal/global-search which add significant JS.
// Using ssr:false since search is interactive-only and not needed for initial paint.
// Fixes: DOCS-8BT (Large Render Blocking Asset)
const Search = dynamic(() => import('./search').then(mod => ({default: mod.Search})), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center gap-2"
      style={{width: '340px', minWidth: '340px', height: '40px'}}
    />
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

export function Header({
  pathname,
  searchPlatforms,
  noSearch,
  useStoredSearchPlatforms,
  platforms = [],
}: Props) {
  const isHomePage = pathname === '/';
  const [homeSearchVisible, setHomeSearchVisible] = useState(true);
  const [homeMobileNavOpen, setHomeMobileNavOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Listen for home search visibility changes
  useHomeSearchVisibility(
    useCallback((isVisible: boolean) => {
      setHomeSearchVisible(isVisible);
    }, [])
  );

  // Track sidebar checkbox state for non-home pages
  useEffect(() => {
    if (isHomePage) {
      return undefined;
    }

    const checkbox = document.getElementById(sidebarToggleId) as HTMLInputElement | null;
    if (!checkbox) {
      return undefined;
    }

    const handleChange = () => {
      setSidebarOpen(checkbox.checked);
    };

    // Set initial state
    setSidebarOpen(checkbox.checked);

    checkbox.addEventListener('change', handleChange);
    return () => checkbox.removeEventListener('change', handleChange);
  }, [isHomePage]);

  // Show header search if: not on home page, OR on home page but home search is scrolled out of view
  const showHeaderSearch = !isHomePage || !homeSearchVisible;

  return (
    <header className="bg-[var(--gray-1)] h-[var(--header-height)] w-full z-50 border-b border-[var(--gray-a3)] fixed top-0 flex items-center justify-center min-h-[64px]">
      {/* define a header-height variable for consumption by other components */}
      <style>{`
        :root { --header-height: 64px; }
        @media (min-width: 2057px) {
          .header-content {
            max-width: calc(var(--sidebar-width, 300px) + var(--doc-content-w, 1100px) + var(--toc-w, 250px) + var(--gap, 24px) * 2);
          }
        }
      `}</style>
      <div className="header-content flex items-center w-full">
        {/* Left: logo + nav links, capped so right block can anchor to viewport edge */}
        <nav className="nav-inner flex items-center gap-4 min-h-[64px] min-w-0 flex-1 px-4 md:pl-3 md:pr-4">
          {/* Hamburger menu - different behavior on home page vs other pages */}
          {isHomePage ? (
            <button
              className="md:hidden mr-3 flex items-center"
              onClick={() => setHomeMobileNavOpen(!homeMobileNavOpen)}
              aria-label={homeMobileNavOpen ? 'Close menu' : 'Open menu'}
            >
              {homeMobileNavOpen ? (
                <Cross1Icon
                  className="inline dark:text-[var(--foreground)] text-[var(--gray-10)]"
                  width="22"
                  height="22"
                />
              ) : (
                <HamburgerMenuIcon
                  className="inline dark:text-[var(--foreground)] text-[var(--gray-10)]"
                  strokeWidth="1.8"
                  width="22"
                  height="22"
                />
              )}
            </button>
          ) : (
            <button className="md:hidden mr-3 flex items-center">
              <label
                htmlFor={sidebarToggleId}
                aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                className="inline-flex items-center cursor-pointer"
              >
                {sidebarOpen ? (
                  <Cross1Icon
                    className="inline dark:text-[var(--foreground)] text-[var(--gray-10)]"
                    width="22"
                    height="22"
                  />
                ) : (
                  <HamburgerMenuIcon
                    className="inline dark:text-[var(--foreground)] text-[var(--gray-10)]"
                    strokeWidth="1.8"
                    width="22"
                    height="22"
                  />
                )}
              </label>
            </button>
          )}
          <Link
            href="/"
            title="Sentry error monitoring"
            className="logo-slot flex flex-shrink-0 items-center text-lg font-medium text-[var(--foreground)] mr-1"
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
          {/* Top nav menu - anchored next to logo */}
          <div className="hidden md:block flex-1 min-w-0">
            <TopNavClient platforms={platforms} />
          </div>
          {/* Mobile: show Ask AI button and theme toggle (below md breakpoint) */}
          <div className="flex items-center md:hidden ml-auto gap-3">
            <button
              className="kapa-ai-class flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)] px-2 py-1.5 rounded-md hover:bg-[var(--gray-a3)] transition-colors"
              aria-label="Ask AI"
            >
              <MagicIcon className="size-4" />
              <span className="uppercase text-xs">Ask AI</span>
            </button>
            <ThemeToggle />
          </div>
        </nav>
        {/* Right: search + actions, anchored to viewport right at any width */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0 ml-auto pl-4 pr-4 lg:pr-6">
          {!noSearch && (
            <div
              className="flex flex-shrink-0 items-center gap-2"
              style={{
                visibility: showHeaderSearch ? 'visible' : 'hidden',
                pointerEvents: showHeaderSearch ? 'auto' : 'none',
                width: '340px',
                minWidth: '340px',
              }}
            >
              <Search
                path={pathname}
                searchPlatforms={searchPlatforms}
                showChatBot
                useStoredSearchPlatforms={useStoredSearchPlatforms}
              />
            </div>
          )}
          {!noSearch && (
            <div className="flex flex-shrink-0 items-center gap-4">
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
        </div>
      </div>

      {/* Home page mobile navigation overlay */}
      {isHomePage && homeMobileNavOpen && (
        <div
          className="md:hidden fixed inset-0 bg-[var(--gray-1)] z-40"
          style={{top: 'var(--header-height)'}}
        >
          <nav className="px-4 py-4 space-y-1">
            {mainSections.map(section => (
              <Link
                key={section.href}
                href={section.href}
                className="block py-3 px-3 rounded-md text-base font-medium text-[var(--gray-12)] hover:bg-[var(--gray-a3)] transition-colors"
                onClick={() => setHomeMobileNavOpen(false)}
              >
                {section.label}
              </Link>
            ))}
            <div className="border-t border-[var(--gray-a3)] my-4" />
            <a
              href="https://sentry.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 px-3 rounded-md text-base font-medium text-[var(--gray-12)] hover:bg-[var(--gray-a3)] transition-colors"
              onClick={() => setHomeMobileNavOpen(false)}
            >
              Go to Sentry
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
