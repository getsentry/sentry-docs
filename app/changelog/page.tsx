import {Fragment} from 'react';
import * as Sentry from '@sentry/nextjs';
import type {Metadata} from 'next';
import {unstable_cache} from 'next/cache';

import List from 'sentry-docs/components/changelog/list';
import prisma from 'sentry-docs/prisma';

import Header from './header';

export const dynamic = 'force-dynamic';

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

export default async function ChangelogList() {
  const changelogs = await getChangelogs();

  return (
    <Fragment>
      <Header loading={false} />
      <List changelogs={changelogs} />
    </Fragment>
  );
}

export function generateMetadata(): Metadata {
  return {
    description:
      'Stay up to date on everything big and small, from product updates to SDK changes with the Sentry Changelog.',
    alternates: {
      canonical: `https://sentry.io/changelog/`,
    },
    other: {
      'sentry-trace': `${Sentry.getActiveSpan()?.toTraceparent()}`,
    },
  };
}
