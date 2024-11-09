import {prismaClient} from './prisma-client';
import {Changelog} from '@prisma/client';
import {unstable_cache} from 'next/cache';

const hashHex = (buffer: ArrayBuffer) => {
  const hexCodes = Array.from(new Uint8Array(buffer)).map(value =>
    value.toString(16).padStart(2, '0')
  );
  return hexCodes.join('');
};

const hashChangelogs = async (changelogs: Changelog[]) => {
  return crypto.subtle
    .digest('SHA-256', new TextEncoder().encode(JSON.stringify(changelogs)))
    .then(hashHex);
};
export const getChangelogsUncached = async () => {
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
  return {
    changelogs,
    hash: await hashChangelogs(changelogs),
  };
};

export const getChangelogs = unstable_cache(getChangelogsUncached, ['changelogs'], {
  tags: ['changelogs'],
});
