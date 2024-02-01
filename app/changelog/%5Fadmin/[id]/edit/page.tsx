import {Fragment} from 'react';
import Link from 'next/link';

import {editChangelog} from 'sentry-docs/actions/changelog';
import {Button} from 'sentry-docs/components/changelog/ui/Button';
import {Input} from 'sentry-docs/components/changelog/ui/Input';
import {Select} from 'sentry-docs/components/changelog/ui/Select';
import {prisma} from 'sentry-docs/prisma';

export default async function ChangelogEditPage({params}: {params: {id: string}}) {
  const changelog = await prisma.changelog.findUnique({
    where: {id: params.id},
    include: {
      author: true,
      category: true,
    },
  });

  const authors = await prisma.user.findMany();

  const categories = await prisma.category.findMany();

  if (!changelog) {
    return (
      <Fragment>
        <header>
          <Heading>Changelog not found</Heading>
        </header>
        <footer>
          <Link href="/changelogs">Return to Changelogs list</Link>
        </footer>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <header className="mb-4">
        <Heading>Edit Changelog</Heading>
      </header>
      <form action={editChangelog} className="px-2 max-w-xl">
        <div>
          <Input
            type="datetime-local"
            label="Published At"
            name="publishedAt"
            className="mb-2"
            defaultValue={new Date(changelog.publishedAt).toISOString().slice(0, 16)}
          />
        </div>
        <div>
          <Input
            type="text"
            label="Title"
            name="title"
            className="mb-2"
            defaultValue={changelog.title}
            required
          />
        </div>
        <div>
          <Input
            type="text"
            label="Content"
            name="content"
            className="mb-2"
            defaultValue={changelog.content}
          />
        </div>
        <div>
          <Input
            type="checkbox"
            label="Published"
            name="published"
            className="mb-2"
            defaultChecked={changelog.published === true}
            required
          />
        </div>
        <div>
          <Input
            type="checkbox"
            label="Deleted"
            name="deleted"
            className="mb-2"
            defaultChecked={changelog.deleted === true}
            required
          />
        </div>
        <div>
          <Select
            name="author"
            className="mt-1 mb-2"
            label="Author"
            placeholder="Select Author"
            defaultValue={{label: changelog.author?.id, value: changelog.author?.id}}
            required
            options={authors.map(author => ({
              label: author.id,
              value: author.id,
            }))}
          />
        </div>
        <div>
          <Select
            name="category"
            className="mt-1 mb-2"
            label="Category"
            placeholder="Select Category"
            defaultValue={{label: changelog.category?.id, value: changelog.category?.id}}
            required
            options={categories.map(category => ({
              label: category.id,
              value: category.id,
            }))}
          />
        </div>

        <input type="hidden" name="id" value={changelog.id} />

        <footer className="flex items-center justify-between mt-2">
          <Link href="/changelogs" className="underline text-gray-500">
            Return to Changelogs list
          </Link>

          <Button type="submit">Update</Button>
        </footer>
      </form>
    </Fragment>
  );
}
