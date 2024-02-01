import {Fragment} from 'react';
import Link from 'next/link';

import {createUser} from 'sentry-docs/actions/user';
import {Button} from 'sentry-docs/components/changelog/ui/Button';
import {Heading} from 'sentry-docs/components/changelog/ui/Heading';
import {Input} from 'sentry-docs/components/changelog/ui/Input';
import {Select} from 'sentry-docs/components/changelog/ui/Select';
import {prisma} from 'sentry-docs/prisma';

export default async function UserCreatePage() {
  const changelogs = await prisma.changelog.findMany();

  return (
    <Fragment>
      <header className="mb-4">
        <Heading>Create User</Heading>
      </header>
      <form action={createUser} className="px-2 max-w-xl">
        <div>
          <Input type="text" label="Password Hash" name="passwordHash" className="mb-2" />
        </div>
        <div>
          <Input type="text" label="External Id" name="externalId" className="mb-2" />
        </div>
        <div>
          <Input type="text" label="Picture" name="picture" className="mb-2" />
        </div>
        <div>
          <Input type="text" label="Email" name="email" className="mb-2" required />
        </div>
        <div>
          <Input type="text" label="Name" name="name" className="mb-2" />
        </div>
        <div>
          <Select
            name="changelogs"
            className="mt-1 mb-2"
            label="Changelogs"
            placeholder="Select Changelogs"
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
            required
          />
        </div>
        <div>
          <Input type="checkbox" label="Admin" name="admin" className="mb-2" required />
        </div>

        <footer className="flex items-center justify-between mt-2">
          <Link href="/users" className="underline text-gray-500">
            Return to Users list
          </Link>

          <Button type="submit">Create</Button>
        </footer>
      </form>
    </Fragment>
  );
}
