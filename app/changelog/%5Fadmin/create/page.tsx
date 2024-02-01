import '@radix-ui/themes/styles.css';

import {Suspense} from 'react';
import Link from 'next/link';

import {createChangelog} from 'sentry-docs/actions/changelog';
import {ForwardRefEditor} from 'sentry-docs/components/changelog/forwardRefEditor';
import {Button} from 'sentry-docs/components/changelog/ui/Button';
import {Input} from 'sentry-docs/components/changelog/ui/Input';
import {Select} from 'sentry-docs/components/changelog/ui/Select';
import {prisma} from 'sentry-docs/prisma';

export default async function ChangelogCreatePage() {
  const authors = await prisma.user.findMany();

  const categories = await prisma.category.findMany();

  return (
    <section className="overflow-x-auto col-start-3 col-span-8">
      <form action={createChangelog} className="px-2 w-full">
        <div>
          <Input
            type="text"
            label="Title"
            name="title"
            className="w-full mb-2"
            required
          />
        </div>
        <div>
          <Select
            name="category"
            className="mt-1 mb-2"
            label="Category"
            placeholder="Select Category"
            options={categories.map(category => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <Suspense fallback={null}>
          <ForwardRefEditor name="content" defaultValue="" className="w-full" />
        </Suspense>
        <div>
          <Input
            type="checkbox"
            label="Published"
            name="published"
            className="mb-2"
            required
          />
        </div>

        <footer className="flex items-center justify-between mt-2">
          <Link href="/changelogs" className="underline text-gray-500">
            Return to Changelogs list
          </Link>

          <Button type="submit">Create</Button>
        </footer>
      </form>
    </section>
  );
}
