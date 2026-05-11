'use client';

import {HamburgerMenuIcon, TriangleRightIcon} from '@radix-ui/react-icons';
import * as Popover from '@radix-ui/react-popover';
import {Box, Button, Theme} from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import SentryLogoSVG from 'sentry-docs/logos/sentry-logo-dark.svg';

import mobileMenuStyles from './mobileMenu/styles.module.scss';
import {NavLink} from './navlink';
import sidebarStyles from './sidebar/style.module.scss';
import {ThemeToggle} from './theme-toggle';

// Lazy load Search to reduce initial bundle size.
const Search = dynamic(() => import('./search').then(mod => ({default: mod.Search})), {
  ssr: false,
  loading: () => (
    <div className="h-10 w-full max-w-md rounded-lg border border-[var(--gray-a5)] bg-[var(--gray-2)] animate-pulse" />
  ),
});

export const developerDocsSidebarToggleId = sidebarStyles['navbar-menu-toggle'];

type Props = {
  pathname: string;
  searchPlatforms: string[];
  noSearch?: boolean;
  useStoredSearchPlatforms?: boolean;
};

export function DevelopDocsHeader({
  pathname,
  searchPlatforms,
  noSearch,
  useStoredSearchPlatforms,
}: Props) {
  return (
    <header className="bg-[var(--gray-1)] h-[var(--header-height)] w-full z-50 border-b border-[var(--gray-a3)] fixed top-0">
      {/* define a header-height variable for consumption by other components */}
      <style>{':root { --header-height: 80px; }'}</style>
      <nav className="nav-inner mx-auto px-3 py-2 flex items-center">
        {pathname !== '/' && (
          <button className="md:hidden mr-3">
            <label
              htmlFor={developerDocsSidebarToggleId}
              aria-label="Toggle sidebar navigation"
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
          className="logo-slot flex flex-shrink-0 items-center lg-xl:w-[calc(var(--sidebar-width,300px)-2rem)] text-2xl font-medium text-[var(--foreground)]"
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
          <div className="hidden md:flex justify-center lg-xl:justify-start max-w-md w-full px-6">
            <Search
              path={pathname}
              searchPlatforms={searchPlatforms}
              showChatBot
              useStoredSearchPlatforms={useStoredSearchPlatforms}
            />
          </div>
        )}
        <div className="hidden lg-xl:flex justify-end flex-1 gap-6 items-center min-w-fit">
          <NavLink href="https://sentry.io/changelog/">Changelog</NavLink>
          <NavLink href="https://sandbox.sentry.io/">Sandbox</NavLink>
          <NavLink href="https://sentry.io/">Go to Sentry</NavLink>
          <NavLink
            href="https://sentry.io/signup/"
            className="transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#fa7faa] hover:via-[#ff9691] hover:to-[#ffb287]"
          >
            Get Started
          </NavLink>
          <ThemeToggle />
        </div>
        <div className="lg-xl:hidden ml-auto">
          <div className="flex gap-6 items-center">
            <Popover.Root>
              <Popover.Trigger asChild>
                <Button
                  variant="ghost"
                  size="4"
                  color="gray"
                  radius="medium"
                  className="font-medium text-[var(--foreground)]"
                >
                  Menu
                  <TriangleRightIcon />
                </Button>
              </Popover.Trigger>
              <Popover.Portal>
                <Theme accentColor="iris">
                  <Popover.Content
                    className={mobileMenuStyles.PopoverContent}
                    sideOffset={5}
                  >
                    <Box display={{xs: 'block', sm: 'none'}}>
                      <li className={mobileMenuStyles.MenuItem}>
                        <Search path={pathname} searchPlatforms={searchPlatforms} />
                      </li>
                      <div className={mobileMenuStyles.MenuSeparator} />
                    </Box>
                    <li className={mobileMenuStyles.MenuItem}>
                      <Link href="https://sentry.io/changelog/">Changelog</Link>
                    </li>
                    <li className={mobileMenuStyles.MenuItem}>
                      <Link href="https://sandbox.sentry.io/">Sandbox</Link>
                    </li>
                    <li className={mobileMenuStyles.MenuItem}>
                      <Link href="https://sentry.io/">Go to Sentry</Link>
                    </li>
                    <li className={mobileMenuStyles.MenuItem}>
                      <Link href="https://sentry.io/signup/">Get Started</Link>
                    </li>
                  </Popover.Content>
                </Theme>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
      </nav>
      <style>{`
        /* Fluid centering to match sidebar offset at wide viewports.
           Use max() to preserve the nav's base 0.75rem (px-3) padding. */
        header .nav-inner {
          padding-left: max(0.75rem, var(--layout-offset, 0px));
          padding-right: max(0.75rem, var(--layout-offset, 0px));
        }
      `}</style>
    </header>
  );
}
