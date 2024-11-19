'use client';

import {editChangelog} from '@/server/actions/changelog';
import {TitleSlug} from '@/client/components/titleSlug';
import {FileUpload} from '@/client/components/fileUpload';
import {Select} from '@/client/components/ui/Select';
import {ForwardRefEditor} from '@/client/components/forwardRefEditor';
import {Button} from '@/client/components/ui/Button';
import {Fragment, Suspense, useActionState} from 'react';
import {Changelog, Category} from '@prisma/client';
import Link from 'next/link';

export const EditChangelogForm = ({
  changelog,
  categories,
}: {
  changelog: Changelog;
  categories: Category[];
}) => {
  const [_state, formAction] = useActionState(editChangelog, {});
  return (
    <form action={formAction} className="px-2 w-full">
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
          defaultValue={categories.map(category => ({
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
  );
};
