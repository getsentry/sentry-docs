import {Fragment} from 'react';

export default function Loading() {
  return (
    <Fragment>
      <div className="bg-gray-300 animate-pulse block rounded w-40 h-6" />
      <div className="bg-gray-300 animate-pulse block rounded w-32 h-6 mt-2" />
      <div className="bg-gray-300 animate-pulse block rounded w-32 h-6 mt-2" />
      <div className="bg-gray-300 animate-pulse block rounded w-32 h-6 mt-2" />
    </Fragment>
  );
}
