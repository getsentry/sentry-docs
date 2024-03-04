import {Fragment} from 'react';
import {PlusIcon} from '@radix-ui/react-icons';
import {Button, Text} from '@radix-ui/themes';
import Link from 'next/link';

import {
  deleteChangelog,
  publishChangelog,
  unpublishChangelog,
} from 'sentry-docs/actions/changelog';
import prisma from 'sentry-docs/prisma';

import Confirm from './confirm';

export default async function ChangelogsListPage() {
  const changelogs = await prisma.changelog.findMany({
    include: {
      categories: true,
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <Fragment>
      <header className="mb-4 col-start-2 col-span-2 text-left">
        <Button>
          <PlusIcon />
          <Link href="/changelog/_admin/create">New Changelog</Link>
        </Button>
      </header>
      <section className="overflow-x-auto col-start-2 col-span-10 shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-4 py-2">Title</th>
              <th className="whitespace-nowrap px-4 py-2">Categories</th>
              <th className="whitespace-nowrap px-4 py-2">Published by</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white border-b hover:bg-gray-50 dark:hover:bg-gray-600">
            {changelogs.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="text-center font-medium text-gray-900 whitespace-nowrap"
                >
                  No changelogs found
                </td>
              </tr>
            )}

            {changelogs.map(changelog => (
              <tr key={changelog.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{changelog.title}</td>

                <td className="px-4 py-2">
                  {changelog.categories.map(category => (
                    <div
                      key={category.id}
                      className="inline whitespace-nowrap p-2 uppercase shadow-sm no-underline rounded-full text-red text-xs mr-1 bg-gray-100"
                    >
                      {category.name}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2 text-center">
                  {changelog.published && (
                    <span className="text-gray-500">
                      <Text size="1">
                        {' '}
                        {new Date(changelog.publishedAt || '').toLocaleDateString(
                          undefined,
                          {month: 'long', day: 'numeric'}
                        )}
                      </Text>
                      <br />
                    </span>
                  )}
                  <Text size="1">{changelog.author?.name}</Text>
                </td>

                <td className="px-4 py-2">
                  <div className="flex h-full justify-end">
                    <Link
                      href={`/changelog/${changelog.slug}`}
                      className="text-indigo-600 hover:bg-indigo-100 rounded-md px-1 py-2 text-xs whitespace-nowrap"
                    >
                      👀 Show
                    </Link>
                    <Link
                      href={`/changelog/_admin/${changelog.id}/edit`}
                      className="text-indigo-600 hover:bg-indigo-100 rounded-md px-1 py-2 text-xs whitespace-nowrap"
                    >
                      📝 Edit
                    </Link>
                    {changelog.published ? (
                      <Confirm action={unpublishChangelog} changelog={changelog}>
                        ⛔️ Unpublish?
                      </Confirm>
                    ) : (
                      <Confirm action={publishChangelog} changelog={changelog}>
                        ✅ Publish?
                      </Confirm>
                    )}
                    <Confirm action={deleteChangelog} changelog={changelog}>
                      💀 Delete?
                    </Confirm>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Fragment>
  );
}
