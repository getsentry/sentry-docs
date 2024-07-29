import {HamburgerMenuIcon} from '@radix-ui/react-icons';
import Image from 'next/image';

import SentryLogoSVG from 'sentry-docs/logos/sentry-logo-dark.svg';

import sidebarStyles from './sidebar/style.module.scss';

import {MobileMenu} from './mobileMenu';
import {NavLink} from './navlink';
import {Search} from './search';

export const sidebarToggleId = sidebarStyles['navbar-menu-toggle'];

type Props = {
  pathname: string;
  searchPlatforms: string[];
  noSearch?: boolean;
};

export function Header({pathname, searchPlatforms, noSearch}: Props) {
  return (
    <header className="bg-white h-[var(--header-height)] w-full z-50 border-b border-gray fixed top-0">
      {/* define a header-height variable for consumption by other components */}
      <style>{':root { --header-height: 80px; }'}</style>
      <nav className="mx-auto px-6 lg:px-8 py-2 flex items-center text-primary">
        {pathname !== '/' && (
          <button className="lg:hidden mr-3">
            <label
              htmlFor={sidebarToggleId}
              aria-label="Close"
              aria-hidden="true"
              className="inline-flex items-center cursor-pointer"
            >
              <HamburgerMenuIcon
                className="inline text-[var(--gray-10)]"
                strokeWidth="1.8"
                width="22"
                height="22"
              />
            </label>
          </button>
        )}
        <a
          href="/"
          title="Sentry error monitoring"
          className="flex flex-shrink-0 items-center lg:w-[calc(var(--sidebar-width,300px)-2rem)] text-2xl font-medium text-darkPurple"
        >
          <div className="h-full pb-[6px]">
            <Image src={SentryLogoSVG} alt="Sentry's logo" width={40} className="h-16" />
          </div>
          Docs
        </a>
        {!noSearch && (
          <div className="hidden md:flex justify-center lg:justify-start w-full px-6">
            <Search path={pathname} searchPlatforms={searchPlatforms} showChatBot />
          </div>
        )}
        <div className="hidden lg:flex justify-end flex-1 space-x-2 items-center">
          <NavLink href="https://sentry.io/changelog/">Changelog</NavLink>
          <NavLink href="https://try.sentry-demo.com/demo/start/">Sandbox</NavLink>
          <NavLink href="https://sentry.io/">Sign In</NavLink>
        </div>
        <div className="lg:hidden ml-auto">
          <MobileMenu pathname={pathname} searchPlatforms={searchPlatforms} />
        </div>
      </nav>
    </header>
  );
}
