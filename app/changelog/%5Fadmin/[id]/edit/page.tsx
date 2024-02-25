import {Fragment, Suspense} from 'react';
import Link from 'next/link';

import {editChangelog} from 'sentry-docs/actions/changelog';
import {FileUpload} from 'sentry-docs/components/changelog/fileUpload';
import {ForwardRefEditor} from 'sentry-docs/components/changelog/forwardRefEditor';
import {TitleSlug} from 'sentry-docs/components/changelog/titleSlug';
import {Button} from 'sentry-docs/components/changelog/ui/Button';
import {Select} from 'sentry-docs/components/changelog/ui/Select';
import prisma from 'sentry-docs/prisma';

export default async function ChangelogCreatePage({params}) {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  const changelog = await prisma.changelog.findUnique({
    where: {id: params.id},
    include: {
      author: true,
      categories: true,
    },
  });

  if (!changelog) {
    return (
      <Fragment>
        <header>
          <h2>Changelog not found</h2>
        </header>
        <footer>
          <Link href="/changelogs">Return to Changelogs list</Link>
        </footer>
      </Fragment>
    );
  }

  return (
    <section className="overflow-x-auto col-start-3 col-span-8">
      <form action={editChangelog} className="px-2 w-full">
        <input type="hidden" name="id" value={changelog.id} />
        <TitleSlug defaultSlug={changelog.slug} defaultTitle={changelog.title} />
        <FileUpload defaultFile={changelog.image || ''} />
        <div className="my-6">
          <label htmlFor="summary" className="block text-xs font-medium text-gray-700">
            Summary
            <Fragment>
              &nbsp;<span className="font-bold text-secondary">*</span>
            </Fragment>
          </label>
          <textarea name="summary" className="w-full" required>
            {changelog.summary}
          </textarea>
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
            defaultValue={changelog.categories.map(category => ({
              label: category.name,
              value: category.name,
            }))}
            options={categories.map(category => ({
              label: category.name,
              value: category.name,
            }))}
            isMulti
          />
        </div>

        <Suspense fallback={null}>
          <ForwardRefEditor
            name="content"
            defaultValue={changelog.content || ''}
            className="w-full"
          />
        </Suspense>

        <footer className="flex items-center justify-between mt-2 mb-8">
          <Link href="/changelog/_admin" className="underline text-gray-500">
            Return to Changelogs list
          </Link>
          <div>
            <Button type="submit">Update</Button>
          </div>
        </footer>
      </form>
    </section>
  );
}
