import Link from 'next/link';

import {SentryWordmarkLogo} from 'sentry-docs/components/wordmarkLogo';

export function Navbar() {
  return (
    <header className="bg-white py-2 sticky top-0 w-full h-16 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-primary">
        <a
          href="/changelog"
          title="Sentry error monitoring"
          className="flex flex-shrink-0 items-center"
        >
          <SentryWordmarkLogo width={150} height={45} />
        </a>
        <div className="flex space-x-4 hidden md:block">
          <Link
            className="hover:bg-gray-100 rounded-md px-3 py-2 text-sm font-medium uppercase"
            href="/changelog"
          >
            Changelog
          </Link>

          <Link
            className="hover:bg-gray-100 rounded-md px-3 py-2 text-sm font-medium uppercase"
            href="https://docs.sentry.io/"
          >
            Documentation
          </Link>

          <Link
            className="hover:bg-gray-100 rounded-md px-3 py-2 text-sm font-medium uppercase"
            href="https://sentry.io/signup/"
          >
            Get started
          </Link>
        </div>
      </nav>
      <div className="hero-top-left-down-slope absolute -bottom-[39] w-full h-10 bg-white" />
    </header>
  );
}
