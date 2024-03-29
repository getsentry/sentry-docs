import {Fragment} from 'react';
import Link from 'next/link';

import {createChangelog} from 'sentry-docs/actions/changelog';
import {FileUpload} from 'sentry-docs/components/changelog/fileUpload';
import {ForwardRefEditor} from 'sentry-docs/components/changelog/forwardRefEditor';
import {TitleSlug} from 'sentry-docs/components/changelog/titleSlug';
import {Button} from 'sentry-docs/components/changelog/ui/Button';
import {Select} from 'sentry-docs/components/changelog/ui/Select';
import prisma from 'sentry-docs/prisma';

export default async function ChangelogCreatePage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <section className="overflow-x-auto col-start-3 col-span-8">
      <form action={createChangelog} className="px-2 w-full">
        <TitleSlug />
        <FileUpload />
        <div className="my-6">
          <label htmlFor="summary" className="block text-xs font-medium text-gray-700">
            Summary
            <Fragment>
              &nbsp;<span className="font-bold text-secondary">*</span>
            </Fragment>
          </label>
          <textarea name="summary" className="w-full" required />
          <span className="text-xs text-gray-500 italic">
            This will be shown in the list
          </span>
        </div>
        <div>
          <Select
            name="categories"
            className="mt-1 mb-6"
            label="Category"
            placeholder="Select Category"
            options={categories.map(category => ({
              label: category.name,
              value: category.name,
            }))}
            isMulti
          />
        </div>

        <ForwardRefEditor name="content" className="w-full" />

        <footer className="flex items-center justify-between mt-2">
          <Link href="/changelog/_admin" className="underline text-gray-500">
            Return to Changelogs list
          </Link>
          <div>
            <Button type="submit">Create (not published yet)</Button>
            <br />
            <span className="text-xs text-gray-500 italic">You can publish it later</span>
          </div>
        </footer>
      </form>
    </section>
  );
}
