import {Fragment} from 'react';

import {deleteChangelog} from 'sentry-docs/actions/changelog';
import {Button} from 'sentry-docs/components/changelog/ui/Button';
import {prisma} from 'sentry-docs/prisma';

export default async function ChangelogsListPage() {
  const changelogs = await prisma.changelog.findMany({
    include: {
      categories: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });

  return (
    <Fragment>
      <header className="mb-4 col-start-10 col-span-1 text-right">
        <Button
          as="a"
          href="/changelog/admin/changelogs/create"
          className="font-medium"
          size="sm"
        >
          New Changelog
        </Button>
      </header>
      <section className="overflow-x-auto col-start-3 col-span-8 shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-4 py-2">Title</th>
              <th className="whitespace-nowrap px-4 py-2">Categories</th>
              <th className="whitespace-nowrap px-4 py-2">Published</th>
              <th className="whitespace-nowrap px-4 py-2">Author Id</th>

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
                <td className="px-4 py-2">
                  {changelog.published ? (
                    <p className="text-xs italic">
                      {new Date(changelog.publishedAt).toLocaleString()}
                    </p>
                  ) : (
                    '⛔️'
                  )}
                </td>
                <td className="px-4 py-2">{changelog.authorId}</td>

                <td className="px-4 py-2">
                  <div className="flex gap-x-1 h-full justify-center">
                    <Button
                      as="a"
                      size="sm"
                      variant="ghost"
                      href={`/changelog/${changelog.slug}`}
                      className="hover:bg-gray-100 rounded-md px-3 py-2 text-sm font-medium uppercase"
                    >
                      Show
                    </Button>
                    <Button
                      as="a"
                      size="sm"
                      variant="ghost"
                      href={`/changelog/admin/changelogs/${changelog.id}/edit`}
                      className="hover:bg-gray-100 rounded-md px-3 py-2 text-sm font-medium uppercase"
                    >
                      Edit
                    </Button>
                    <form action={deleteChangelog} className="inline-block">
                      <input type="hidden" name="id" value={changelog.id} />
                      <Button type="submit" className="font-medium">
                        Delete
                      </Button>
                    </form>
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
