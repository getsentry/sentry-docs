import * as Sentry from '@sentry/nextjs';
import type {Metadata} from 'next';
import Link from 'next/link';

import List from 'sentry-docs/components/changelog/list';
import Pagination from 'sentry-docs/components/changelog/pagination';
import Search from 'sentry-docs/components/changelog/search';

import {ChangelogSearchParams, getParams, queryData} from './helpers';

export default async function ChangelogList({
  searchParams,
}: {
  searchParams: ChangelogSearchParams;
}) {
  const {filtered} = getParams(searchParams);
  const {changelogs, pagination} = await queryData(searchParams);

  return (
    <div className="max-w-3xl mx-auto px-4 pb-4 sm:px-6 md:px-8">
      <div className="flex justify-between items-center py-6 space-x-4">
        <Search placeholder="Search..." />
        <div className="flex space-x-4">
          <Link
            className={`${filtered ? 'text-purple font-medium' : 'text-gray-500'} hover:text-gray-700`}
            href="/changelog/"
          >
            Reset
          </Link>
        </div>
      </div>
      <List changelogs={changelogs} />
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      )}
      {!changelogs.length && (
        <div className="flex items-center my-4">
          <div className="flex-1 border-t-[1px] border-gray-400" />
          <span className="px-3 text-gray-500">No posts found.</span>
          <div className="flex-1 border-t-[1px] border-gray-400" />
        </div>
      )}
    </div>
  );
}

export function generateMetadata(): Metadata {
  return {
    description:
      'Stay up to date on everything big and small, from product updates to SDK changes with the Sentry Changelog.',
    other: {
      'sentry-trace': `${Sentry.getActiveSpan()?.toTraceparent()}`,
    },
  };
}
