import {Fragment} from 'react';
import Link from 'next/link';

import {editUser} from 'sentry-docs/actions/user';
import {Button} from 'sentry-docs/components/changelog/ui/Button';
import {Heading} from 'sentry-docs/components/changelog/ui/Heading';
import {Input} from 'sentry-docs/components/changelog/ui/Input';
import {Select} from 'sentry-docs/components/changelog/ui/Select';
import {prisma} from 'sentry-docs/prisma';

export default async function UserEditPage({params}: {params: {id: string}}) {
  const user = await prisma.user.findUnique({
    where: {id: params.id},
    include: {
      changelogs: true,
    },
  });

  const changelogs = await prisma.changelog.findMany();

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
      <header className="mb-4">
        <Heading>Edit User</Heading>
      </header>
      <form action={editUser} className="px-2 max-w-xl">
        <div>
          <Input
            type="text"
            label="Password Hash"
            name="passwordHash"
            className="mb-2"
            defaultValue={user.passwordHash}
          />
        </div>
        <div>
          <Input
            type="text"
            label="External Id"
            name="externalId"
            className="mb-2"
            defaultValue={user.externalId}
          />
        </div>
        <div>
          <Input
            type="text"
            label="Picture"
            name="picture"
            className="mb-2"
            defaultValue={user.picture}
          />
        </div>
        <div>
          <Input
            type="text"
            label="Email"
            name="email"
            className="mb-2"
            defaultValue={user.email}
            required
          />
        </div>
        <div>
          <Input
            type="text"
            label="Name"
            name="name"
            className="mb-2"
            defaultValue={user.name}
          />
        </div>
        <div>
          <Select
            name="changelogs"
            className="mt-1 mb-2"
            label="Changelogs"
            placeholder="Select Changelogs"
            defaultValue={user.changelogs.map(changelog => ({
              label: changelog.id,
              value: changelog.id,
            }))}
            isMulti
            options={changelogs.map(changelog => ({
              label: changelog.id,
              value: changelog.id,
            }))}
          />
        </div>
        <div>
          <Input
            type="checkbox"
            label="Can Post Restricted"
            name="canPostRestricted"
            className="mb-2"
            defaultChecked={user.canPostRestricted === true}
            required
          />
        </div>
        <div>
          <Input
            type="checkbox"
            label="Admin"
            name="admin"
            className="mb-2"
            defaultChecked={user.admin === true}
            required
          />
        </div>

        <input type="hidden" name="id" value={user.id} />

        <footer className="flex items-center justify-between mt-2">
          <Link href="/users" className="underline text-gray-500">
            Return to Users list
          </Link>

          <Button type="submit">Update</Button>
        </footer>
      </form>
    </Fragment>
  );
}
