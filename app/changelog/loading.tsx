import {Fragment} from 'react';

import Article from 'sentry-docs/components/changelog/article';

import Header from './header';

export default function Loading() {
  return (
    <Fragment>
      <Header loading />
      <div className="w-full mx-auto grid grid-cols-12 bg-gray-200">
        <div className="hidden md:block md:col-span-2 pl-5 pt-10">
          <h3 className="text-2xl text-primary font-semibold mb-2">Categories:</h3>
          <div className="flex flex-wrap gap-1 py-1">
            <div className="bg-gray-300 animate-pulse block rounded w-40 h-8" />
            <div className="flex flex-wrap gap-1 py-1 mt-2">
              <div className="bg-gray-300 animate-pulse block rounded w-12 h-6" />
              <div className="bg-gray-300 animate-pulse block rounded w-20 h-6" />
              <div className="bg-gray-300 animate-pulse block rounded w-12 h-6" />
              <div className="bg-gray-300 animate-pulse block rounded w-20 h-6" />
              <div className="bg-gray-300 animate-pulse block rounded w-16 h-6" />
              <div className="bg-gray-300 animate-pulse block rounded w-12 h-6" />
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-8">
          <div className="max-w-3xl mx-auto px-4 pb-4 sm:px-6 md:px-8 mt-28">
            <Article loading />
          </div>
        </div>
        <div className="hidden md:block md:col-span-2 pl-5 pt-10">
          <h3 className="text-1xl text-primary font-semibold mb-2">Jump to:</h3>
          <div className="bg-gray-300 animate-pulse block rounded w-40 h-6" />
          <div className="bg-gray-300 animate-pulse block rounded w-32 h-6 mt-2" />
          <div className="bg-gray-300 animate-pulse block rounded w-32 h-6 mt-2" />
          <div className="bg-gray-300 animate-pulse block rounded w-32 h-6 mt-2" />
        </div>
      </div>
    </Fragment>
  );
}
