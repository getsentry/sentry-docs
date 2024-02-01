import {Fragment} from 'react';
import Link from 'next/link';

import {prisma} from 'sentry-docs/prisma';

export default async function ChangelogPage({params}: {params: {id: string}}) {
  const changelog = await prisma.changelog.findUnique({
    where: {id: params.id},
  });

  if (!changelog) {
    return (
      <Fragment>
        <header>
          <h1>Changelog not found</h1>
        </header>
        <footer>
          <Link href="/changelogs">Return to Changelogs list</Link>
        </footer>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <header className="mt-2 mb-4">
        <h1>Changelog #{changelog.id.substring(0, 6)}...</h1>
      </header>

      <section className="relative overflow-hidden rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8 max-w-xl mb-4">
        <span className="absolute inset-x-0 bottom-0 h-21 bg-gradient-to-r from-indigo-300 via-indigo-500 to-indigo-600" />
        <p className="text-gray-700 mb-4 last:mb-0">
          <strong className="text-gray-900">Published At:</strong>{' '}
          {new Date(changelog.publishedAt).toLocaleString()}
        </p>
        <p className="text-gray-700 mb-4 last:mb-0">
          <strong className="text-gray-900">Title:</strong> {changelog.title}
        </p>
        <p className="text-gray-700 mb-4 last:mb-0">
          <strong className="text-gray-900">Content:</strong> {changelog.content}
        </p>
        <p className="text-gray-700 mb-4 last:mb-0">
          <strong className="text-gray-900">Published:</strong>{' '}
          {changelog.published ? 'Yes' : 'No'}
        </p>
        <p className="text-gray-700 mb-4 last:mb-0">
          <strong className="text-gray-900">Deleted:</strong>{' '}
          {changelog.deleted ? 'Yes' : 'No'}
        </p>
        <p className="text-gray-700 mb-4 last:mb-0">
          <strong className="text-gray-900">Author Id:</strong> {changelog.authorId}
        </p>
        <p className="text-gray-700 mb-4 last:mb-0">
          <strong className="text-gray-900">Category Id:</strong> {changelog.categoryId}
        </p>
      </section>

      <footer>
        <Link href="/changelogs" className="underline text-gray-500">
          Return to Changelogs list
        </Link>
      </footer>
    </Fragment>
  );
}
