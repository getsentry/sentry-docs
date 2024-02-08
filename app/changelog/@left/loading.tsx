import {Fragment} from 'react';

export default function Loading() {
  return (
    <Fragment>
      <div className="bg-gray-300 animate-pulse block rounded w-40 h-8" />
      <div className="flex flex-wrap gap-1 py-1 mt-2">
        <div className="bg-gray-300 animate-pulse block rounded w-12 h-6" />
        <div className="bg-gray-300 animate-pulse block rounded w-20 h-6" />
        <div className="bg-gray-300 animate-pulse block rounded w-12 h-6" />
        <div className="bg-gray-300 animate-pulse block rounded w-20 h-6" />
        <div className="bg-gray-300 animate-pulse block rounded w-16 h-6" />
        <div className="bg-gray-300 animate-pulse block rounded w-12 h-6" />
      </div>
    </Fragment>
  );
}
