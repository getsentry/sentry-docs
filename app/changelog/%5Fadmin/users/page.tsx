import {Fragment} from 'react';

import {deleteUser} from 'sentry-docs/actions/user';
import {Breadcrumbs} from 'sentry-docs/components/changelog/ui/Breadcrumbs';
import {Button} from 'sentry-docs/components/changelog/ui/Button';
import {Heading} from 'sentry-docs/components/changelog/ui/Heading';
import {prisma} from 'sentry-docs/prisma';

export default async function UsersListPage() {
  const users = await prisma.user.findMany();

  const breadcrumbs = [
    {name: 'Dashboard', href: '/'},
    {name: 'Users', href: '#'},
  ];

  return (
    <Fragment>
      <Breadcrumbs elements={breadcrumbs} className="my-2" />

      <header className="flex justify-between mb-4">
        <Heading>All Users</Heading>
        <Button as="a" href="/users/create" className="font-medium">
          New User
        </Button>
      </header>

      <section className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="text-left">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Password Hash
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                External Id
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Picture
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Email
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Name
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Can Post Restricted
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Admin
              </th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-gray-500 py-4">
                  No users found
                </td>
              </tr>
            )}

            {users.map(user => (
              <tr key={user.id}>
                <td className="px-4 py-2 text-gray-700">{user.passwordHash}</td>
                <td className="px-4 py-2 text-gray-700">{user.externalId}</td>
                <td className="px-4 py-2 text-gray-700">{user.picture}</td>
                <td className="px-4 py-2 text-gray-700">{user.email}</td>
                <td className="px-4 py-2 text-gray-700">{user.name}</td>
                <td className="px-4 py-2 text-gray-700">
                  {user.canPostRestricted ? 'Yes' : 'No'}
                </td>
                <td className="px-4 py-2 text-gray-700">{user.admin ? 'Yes' : 'No'}</td>

                <td className="px-4 py-2">
                  <div className="flex gap-x-1 h-full justify-center">
                    <Button
                      as="a"
                      href={`/users/${user.id}`}
                      variant="ghost"
                      size="sm"
                      className="font-medium"
                    >
                      Show
                    </Button>
                    <Button
                      as="a"
                      href={`/users/${user.id}/edit`}
                      variant="ghost"
                      size="sm"
                      className="font-medium"
                    >
                      Edit
                    </Button>
                    <form action={deleteUser} className="inline-block">
                      <input type="hidden" name="id" value={user.id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="font-medium text-red-600 hover:bg-red-100 disabled:bg-red-100"
                      >
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
