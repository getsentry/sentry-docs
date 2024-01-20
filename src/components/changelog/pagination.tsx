import {Fragment} from 'react';
import Link from 'next/link';

export default function Pagination({totalPages, currentPage}) {
  const prevPage = parseInt(currentPage, 10) - 1 > 0;
  const nextPage = parseInt(currentPage, 10) + 1 <= parseInt(totalPages, 10);

  const pages: Array<number> = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <ConditionalLink href={`?page=${currentPage - 1}`} condition={prevPage}>
        <button
          disabled={!prevPage}
          className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Previous
        </button>
      </ConditionalLink>
      <div className="flex items-center gap-2">
        {pages.map(page => (
          <Link key={page} href={`?page=${page}`}>
            <button
              className={`${page === currentPage ? 'bg-gray-900 relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg  text-center align-middle font-sans text-xs font-medium uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none' : 'relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'}`}
              type="button"
            >
              <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                {page}
              </span>
            </button>
          </Link>
        ))}
      </div>
      <ConditionalLink href={`?page=${currentPage + 1}`} condition={nextPage}>
        <button
          disabled={!nextPage}
          className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      </ConditionalLink>
    </div>
  );
}

function ConditionalLink({children, condition, href, ...props}) {
  return condition ? (
    <Link href={href} {...props}>
      {children}
    </Link>
  ) : (
    <Fragment>{children}</Fragment>
  );
}
