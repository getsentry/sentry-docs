'use client';

import {Fragment} from 'react';
import {HamburgerMenuIcon} from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';

import SentryLogoSVG from 'sentry-docs/logos/sentry-logo-dark.svg';

import sidebarStyles from './sidebar/style.module.scss';

import {MobileMenu} from './mobileMenu';
import {NavLink} from './navlink';
import {Search} from './search';
import {ThemeToggle} from './theme-toggle';

export const sidebarToggleId = sidebarStyles['navbar-menu-toggle'];

type Props = {
  pathname: string;
  searchPlatforms: string[];
  noSearch?: boolean;
  useStoredSearchPlatforms?: boolean;
};

export function Header({
  pathname,
  searchPlatforms,
  noSearch,
  useStoredSearchPlatforms,
}: Props) {
  return (
    <header className="bg-[var(--gray-1)] h-[var(--header-height)] w-full z-50 border-b border-[var(--gray-a3)] fixed top-0">
      {/* define a header-height variable for consumption by other components */}
      <style>{':root { --header-height: 80px; }'}</style>
      <nav className="mx-auto px-6 lg:px-8 py-2 flex items-center">
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
          className="flex flex-shrink-0 items-center lg:w-[calc(var(--sidebar-width,300px)-2rem)] text-2xl font-medium text-[var(--foreground)]"
        >
          <div className="h-full pb-[6px]">
            <Image
              src={SentryLogoSVG}
              alt="Sentry's logo"
              width={40}
              className="h-16 dark:invert"
            />
          </div>
          Docs
        </Link>
        {!noSearch && (
          <div className="hidden md:flex justify-center lg:justify-start w-full px-6">
            <Search
              path={pathname}
              searchPlatforms={searchPlatforms}
              showChatBot
              useStoredSearchPlatforms={useStoredSearchPlatforms}
            />
          </div>
        )}
        <div className="hidden lg-xl:flex justify-end flex-1 space-x-2 items-center min-w-fit">
          <NavLink href="https://sentry.io/changelog/">Changelog</NavLink>
          <NavLink href="https://try.sentry-demo.com/demo/start/">Sandbox</NavLink>
          <Fragment>
            <NavLink href="https://sentry.io/">Go to Sentry</NavLink>
            <NavLink
              href="https://sentry.io/signup/"
              className="transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#fa7faa] hover:via-[#ff9691] hover:to-[#ffb287]"
            >
              Get Started
            </NavLink>
          </Fragment>
          <ThemeToggle />
        </div>
        <div className="lg-xl:hidden ml-auto">
          <MobileMenu pathname={pathname} searchPlatforms={searchPlatforms} />
        </div>
      </nav>
    </header>
  );
}
