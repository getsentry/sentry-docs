import {prismaClient} from '@/server/prisma-client';
import {unstable_cache} from 'next/cache';

export const getChangelogs = unstable_cache(
  async () => {
    return await prismaClient.changelog.findMany({
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
