import {unstable_cache} from 'next/cache';

import prisma from 'sentry-docs/prisma';

export const getChangelogs = unstable_cache(
  async () => {
    return await prisma.changelog.findMany({
      include: {
        categories: true,
      },
      where: {
        published: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });
  },
  ['changelogs'],
  {tags: ['changelogs']}
);
