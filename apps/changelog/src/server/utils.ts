import {prismaClient} from '@/server/prisma-client';
import {Changelog} from '@prisma/client';
import {unstable_cache} from 'next/cache';

export const getChangelogs = unstable_cache(
  async () => {
    const changelogs = await prismaClient.changelog.findMany({
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
    const hashHex = (buffer: ArrayBuffer) => {
      const hexCodes = Array.from(new Uint8Array(buffer)).map(value =>
        value.toString(16).padStart(2, '0')
      );
      return hexCodes.join('');
    };
    const hashChangelogs = (changelogs: Changelog[]) =>
      crypto.subtle
        .digest(
          'SHA-256',
          new TextEncoder().encode(
            changelogs
              .map(changelogs => changelogs.id + ':' + changelogs.updatedAt)
              .join(',')
          )
        )
        .then(hashHex);
    return {
      changelogs,
      hash: await hashChangelogs(changelogs),
    };
  },
  ['changelogs'],
  {tags: ['changelogs']}
);
