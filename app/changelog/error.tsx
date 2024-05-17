'use client'; // Error components must be Client Components

import {Fragment, useEffect} from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <Fragment>
      <div className="w-full mx-auto h-96 relative bg-darkPurple">
        <div className="flex flex-col w-full h-64 lg:max-w-7xl mx-auto px-4 lg:px-8 pt-24 items-center">
          <h1 className="justify-self-center text-white font-bold text-4xl text-center">
            ಠ_ಠ Something went wrong!
          </h1>
          <a
            className="text-gold font-bold text-xl cursor-pointer hover:underline"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </a>
        </div>
        <div className="hero-bottom-left-down-slope absolute bottom-0 w-full h-10 bg-gray-200" />
      </div>
      <div className="relative min-h-[calc(100vh-8rem)] w-full mx-auto grid grid-cols-12 bg-gray-200" />
    </Fragment>
  );
}
