'use client';

import {Cross1Icon, HamburgerMenuIcon, MagnifyingGlassIcon} from '@radix-ui/react-icons';
import {Button} from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import {useCallback, useEffect, useState} from 'react';
import SentryLogoSVG from 'sentry-docs/logos/sentry-logo-dark.svg';
import {Platform} from 'sentry-docs/types';

import {MagicIcon} from './cutomIcons/magic';
import {useHomeSearchVisibility} from './homeSearchVisibility';
import {mainSections} from './navigationData';
import sidebarStyles from './sidebar/style.module.scss';
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Listen for home search visibility changes
  useHomeSearchVisibility(
    useCallback((isVisible: boolean) => {
      setHomeSearchVisible(isVisible);
    }, [])
  );

  // Close mobile search overlay on navigation
  useEffect(() => {
    setMobileSearchOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile search overlay is open, close on resize to desktop or escape key
  useEffect(() => {
    if (mobileSearchOpen) {
      document.body.style.overflow = 'hidden';

      // Close mobile search if viewport is resized to desktop width
      const handleResize = () => {
        if (window.innerWidth >= 768) {
          setMobileSearchOpen(false);
        }
      };

      // Close mobile search on escape key (only if search input is empty)
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          // Check if search input has a value - if so, let the Search component
          // handle the escape key to clear the query first
          const searchInput = document.querySelector(
            '.mobile-search-overlay input[type="text"]'
          ) as HTMLInputElement | null;
          if (!searchInput?.value) {
            setMobileSearchOpen(false);
          }
        }
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
    return undefined;
  }, [mobileSearchOpen]);

  // Track sidebar checkbox state for non-home pages
  useEffect(() => {
    if (isHomePage) {
      // Reset sidebar state when navigating to home page to prevent stale scroll lock
      setSidebarOpen(false);
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

  // Lock body scroll when sidebar is open on mobile (fixes iOS Safari touch scrolling)
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';

      // Close sidebar if viewport is resized to desktop width
      const handleResize = () => {
        if (window.innerWidth >= 768) {
          const checkbox = document.getElementById(
            sidebarToggleId
          ) as HTMLInputElement | null;
          if (checkbox) {
            checkbox.checked = false;
            setSidebarOpen(false);
          }
        }
      };

      window.addEventListener('resize', handleResize);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('resize', handleResize);
      };
    }
    return undefined;
  }, [sidebarOpen]);

  // Show header search if: not on home page, OR on home page but home search is scrolled out of view
  const showHeaderSearch = !isHomePage || !homeSearchVisible;

  return (
    <header className="bg-[var(--gray-1)] h-[var(--header-height)] w-full z-50 border-b border-[var(--gray-a3)] fixed top-0 flex items-center min-h-[64px]">
      {/* define a header-height variable for consumption by other components */}
      <style>{`
        :root { --header-height: 64px; }
        /* Home page: align header content with max-w-screen-xl (1280px) content */
        /* The nav element has px-4 (16px) on mobile, md:pl-3 (12px) on desktop */
        /* Home content uses px-4 (16px), sm:px-8 (32px), lg:px-[50px] */
        /* So we subtract the nav's padding from the content's padding */
        .header-content-home {
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 0;
          padding-right: 0;
        }
        @media (min-width: 640px) {
          .header-content-home {
            /* 32px (content) - 16px (nav px-4) = 16px */
            padding-left: 16px;
            padding-right: 16px;
          }
        }
        @media (min-width: 768px) {
          .header-content-home {
            /* 32px (content) - 12px (nav md:pl-3) = 20px on left */
            /* 32px (content) - 16px (nav md:pr-4) = 16px on right */
            padding-left: 20px;
            padding-right: 16px;
          }
        }
        @media (min-width: 1024px) {
          .header-content-home {
            /* 50px (content) - 12px (nav md:pl-3) = 38px on left */
            /* 50px (content) - 24px (right div lg:pr-6) = 26px on right */
            padding-left: 38px;
            padding-right: 26px;
          }
        }
        /* Doc pages: align header with sidebar and TOC at large viewports */
        @media (min-width: 2057px) {
          .header-content:not(.header-content-home) {
            --sidebar-width: 300px;
            --doc-content-w: 1100px;
            --toc-w: 250px;
            --gap: 24px;
            /* Match sidebar left edge position */
            padding-left: calc(50% - (var(--doc-content-w) / 2) - var(--gap) - var(--sidebar-width));
            /* Match TOC right edge position */
            padding-right: calc(50% - (var(--doc-content-w) / 2) - var(--gap) - var(--toc-w));
          }
        }
      `}</style>
      <div
        className={`header-content flex items-center w-full ${isHomePage ? 'header-content-home' : ''}`}
      >
        {/* Left: logo + nav links, capped so right block can anchor to viewport edge */}
        <nav className="nav-inner flex items-center gap-4 min-h-[64px] min-w-0 flex-1 px-4 md:pl-3 md:pr-4">
          {/* Hamburger menu - different behavior on home page vs other pages */}
          {isHomePage ? (
            <button
              className="md:hidden mr-3 flex items-center"
              onClick={() => {
                setHomeMobileNavOpen(!homeMobileNavOpen);
                setMobileSearchOpen(false);
              }}
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
            className="logo-slot flex flex-shrink-0 items-center text-lg font-medium text-[var(--foreground)] mr-1 py-2 border-b-2 border-transparent -translate-y-[1px]"
            style={{minWidth: 0}}
          >
            <div className="mr-2">
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
          {/* Mobile: show search, Ask AI button and theme toggle (below md breakpoint) */}
          <div className="flex items-center md:hidden ml-auto gap-3">
            {!noSearch && (
              <button
                className="flex items-center text-[var(--foreground)] p-1.5 rounded-md hover:bg-[var(--gray-a3)] transition-colors"
                onClick={() => {
                  setMobileSearchOpen(true);
                  setHomeMobileNavOpen(false);
                  // Close sidebar to prevent competing scroll locks
                  const checkbox = document.getElementById(
                    sidebarToggleId
                  ) as HTMLInputElement | null;
                  if (checkbox) {
                    checkbox.checked = false;
                    setSidebarOpen(false);
                  }
                }}
                aria-label="Search"
              >
                <MagnifyingGlassIcon width="20" height="20" />
              </button>
            )}
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

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div
          className="mobile-search-overlay md:hidden fixed inset-0 bg-[var(--gray-1)] z-50 overflow-hidden flex flex-col"
          style={{top: 'var(--header-height)'}}
          // Stop propagation to prevent Search's useOnClickOutside from dismissing results
          // when clicking on the overlay header or padding areas
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col flex-1 overflow-hidden px-4">
            <div className="flex items-center gap-2 py-4">
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="flex items-center justify-center p-2 rounded-md hover:bg-[var(--gray-a3)] transition-colors"
                aria-label="Close search"
              >
                <Cross1Icon width="20" height="20" />
              </button>
              <span className="text-sm font-medium text-[var(--foreground)]">Search</span>
            </div>
            <div className="flex-1 overflow-auto">
              <Search
                path={pathname}
                searchPlatforms={searchPlatforms}
                autoFocus
                useStoredSearchPlatforms={useStoredSearchPlatforms}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
