import {Fragment} from 'react';
import Link from 'next/link';

import {Heading} from 'sentry-docs/components/changelog/ui/Heading';
import {prisma} from 'sentry-docs/prisma';

export default async function UserPage({params}: {params: {id: string}}) {
  const user = await prisma.user.findUnique({
    where: {id: params.id},
  });

  if (!user) {
    return (
      <Fragment>
        <header>
          <Heading>User not found</Heading>
        </header>
        <footer>
          <Link href="/users">Return to Users list</Link>
        </footer>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <header className="mt-2 mb-4">
        <Heading>User #{user.id.substring(0, 6)}...</Heading>
      </header>

      <section className="relative overflow-hidden rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8 max-w-xl mb-4">
        <span className="absolute inset-x-0 bottom-0 h-21 bg-gradient-to-r from-indigo-300 via-indigo-500 to-indigo-600" />
        <p className="text-gray-700 mb-4 last:mb-0">
          <strong className="text-gray-900">Password Hash:</strong> {user.passwordHash}
        </p>
        <p className="text-gray-700 mb-4 last:mb-0">
          <strong className="text-gray-900">External Id:</strong> {user.externalId}
        </p>
        <p className="text-gray-700 mb-4 last:mb-0">
          <strong className="text-gray-900">Picture:</strong> {user.picture}
        </p>
        <p className="text-gray-700 mb-4 last:mb-0">
          <strong className="text-gray-900">Email:</strong> {user.email}
        </p>
        <p className="text-gray-700 mb-4 last:mb-0">
          <strong className="text-gray-900">Name:</strong> {user.name}
        </p>
        <p className="text-gray-700 mb-4 last:mb-0">
          <strong className="text-gray-900">Can Post Restricted:</strong>{' '}
          {user.canPostRestricted ? 'Yes' : 'No'}
        </p>
        <p className="text-gray-700 mb-4 last:mb-0">
          <strong className="text-gray-900">Admin:</strong> {user.admin ? 'Yes' : 'No'}
        </p>
      </section>

      <footer>
        <Link href="/users" className="underline text-gray-500">
          Return to Users list
        </Link>
      </footer>
    </Fragment>
  );
}
