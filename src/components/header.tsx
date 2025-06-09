'use client';

import {HamburgerMenuIcon} from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';

import SentryLogoSVG from 'sentry-docs/logos/sentry-logo-dark.svg';
import {Platform} from 'sentry-docs/types';

import sidebarStyles from './sidebar/style.module.scss';

import {MobileMenu} from './mobileMenu';
import {Search} from './search';
import {ThemeToggle} from './theme-toggle';
import TopNavClient from './TopNavClient';

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
  return (
    <header className="bg-[var(--gray-1)] h-[var(--header-height)] w-full z-50 border-b border-[var(--gray-a3)] fixed top-0">
      <style>{':root { --header-height: 64px; }'}</style>
      <nav className="mx-auto px-4 lg:px-8 flex items-center gap-4 min-h-[64px]">
        {pathname !== '/' && (
          <button className="lg:hidden mr-3">
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
          className="flex flex-shrink-0 items-center text-lg font-medium text-[var(--foreground)] mr-2"
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
        <div className="flex-1 min-w-0 flex items-center gap-4">
          <div className="hidden sm:block flex-1 min-w-0">
            <TopNavClient platforms={platforms} />
          </div>
          {!noSearch && (
            <div className="hidden sm:flex flex-shrink-0 items-center gap-2 min-w-[320px] max-w-lg ml-4">
              <Search
                path={pathname}
                searchPlatforms={searchPlatforms}
                showChatBot
                useStoredSearchPlatforms={useStoredSearchPlatforms}
              />
              <ThemeToggle />
            </div>
          )}
          {!noSearch && (
            <div className="flex items-center sm:hidden ml-2 gap-2">
              <MobileMenu pathname={pathname} searchPlatforms={searchPlatforms || []} />
              <ThemeToggle />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
