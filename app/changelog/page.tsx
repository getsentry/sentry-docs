import {Fragment} from 'react';
import * as Sentry from '@sentry/nextjs';
import type {Metadata} from 'next';

import List from 'sentry-docs/components/changelog/list';
import prisma from 'sentry-docs/prisma';

import Header from './header';

export default async function ChangelogList() {
  const changelogs = await prisma.changelog.findMany({
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
