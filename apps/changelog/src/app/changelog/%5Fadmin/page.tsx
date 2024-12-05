import {Fragment} from 'react';
import {PlusIcon} from '@radix-ui/react-icons';
import {Button, Text} from '@radix-ui/themes';
import Link from 'next/link';

import Confirm from './confirm';
import {prismaClient} from '@/server/prisma-client';
import {
  deleteChangelog,
  publishChangelog,
  unpublishChangelog,
} from '@/server/actions/changelog';
import {getServerSession} from 'next-auth/next';
import {notFound} from 'next/navigation';
import {authOptions} from '@/server/authOptions';

export default async function ChangelogsListPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return notFound();
  }

  const changelogs = await prismaClient.changelog.findMany({
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
      <header className="text-left pl-4 mb-4">
        <p>
          <Link href="/changelog" className="underline">
            « Back to changelogs
          </Link>
        </p>
        <Button>
          <PlusIcon />
          <Link href="/changelog/_admin/create">New Changelog</Link>
        </Button>
        <p>Post Guidelines</p>
        <ul>
          <li>
            - Be very matter of fact, direct, and simple. Avoid using words like "excited
            to announce".
          </li>
          <li>- Spell out the what, the why, and how to use it.</li>
          <li>
            - Avoid exclamation points, adjectives, references to competition, and
            personal opinions.
          </li>
        </ul>
      </header>

      <table className="table-fixed w-11/12 mx-auto text-sm text-left text-gray-500">
        <colgroup>
          <col style={{width: '30%'}} />
          <col style={{width: '30%'}} />
          <col style={{width: '20%'}} />
          <col style={{width: '20%'}} />
        </colgroup>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="whitespace-nowrap px-4 py-2">Title</th>
            <th className="px-4 py-2 break-words">Categories</th>
            <th className="whitespace-nowrap px-4 py-2">Published by</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white border-b hover:bg-gray-50 dark:hover:bg-gray-600">
          {changelogs.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="text-center font-medium text-gray-900 whitespace-nowrap"
              >
                No changelogs found
              </td>
            </tr>
          )}

          {changelogs.map(changelog => (
            <tr key={changelog.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-2 font-medium text-gray-900">{changelog.title}</td>

              <td className="px-4 py-2 break-words">
                {changelog.categories.map(category => (
                  <div
                    key={category.id}
                    className="inline whitespace-nowrap p-2 uppercase shadow-sm no-underline rounded-full text-red text-xs mr-1 mb-4 bg-gray-100"
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
                      {new Date(changelog.publishedAt || '').toLocaleDateString('en-EN', {
                        month: 'long',
                        day: 'numeric',
                        timeZone: 'UTC',
                      })}
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
    </Fragment>
  );
}
