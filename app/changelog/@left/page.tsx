import {Fragment} from 'react';

import Tags from 'sentry-docs/components/changelog/tags';
import {prisma} from 'sentry-docs/prisma';

export default async function Page() {
  const categories = await prisma.category.findMany();

  return (
    <Fragment>
      <h3 className="text-2xl text-primary font-semibold mb-2">Categories:</h3>
      <div className="flex flex-wrap gap-1 py-1">
        <Tags categories={categories} />
      </div>
    </Fragment>
  );
}
