import Image from 'next/image';
import Link from 'next/link';

import SentryWordmarkSVG from 'sentry-docs/logos/sentry-wordmark-dark.svg';

export function Navbar() {
  return (
    <header className="bg-white py-2">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-primary">
        <a
          href="/"
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
              href="https://sentry.io/"
            >
              Sign In
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                className="inline bi bi-arrow-right-short mb-1"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                />
              </svg>
            </Link>
          
        </div>
      </nav>
    </header>
  );
}
