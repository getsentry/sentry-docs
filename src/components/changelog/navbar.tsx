import Image from 'next/image';
import Link from 'next/link';

import SentryWordmarkSVG from 'sentry-docs/logos/sentry-wordmark-dark.svg';

export function Navbar() {
  return (
    <header className="bg-white py-2 sticky top-0 w-full h-16 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-primary">
        <a
          href="/changelog"
          title="Sentry error monitoring"
          className="flex flex-shrink-0 items-center"
        >
          <Image src={SentryWordmarkSVG} alt="Sentry's logo" width={150} />
        </a>
        <div className="flex space-x-4">
          <Link
            className="hover:bg-gray-100 rounded-md px-3 py-2 text-sm font-medium uppercase"
            href="/changelog"
          >
            Changelog
          </Link>

          <Link
            className="hover:bg-gray-100 rounded-md px-3 py-2 text-sm font-medium uppercase"
            href="/"
          >
            Documentation
          </Link>

          <Link
            className="hover:bg-gray-100 rounded-md px-3 py-2 text-sm font-medium uppercase"
            href="/"
          >
            Get started
          </Link>
        </div>
      </nav>
      <div className="hero-top-left-down-slope absolute -bottom-[39] w-full h-10 bg-white" />
    </header>
  );
}
