import {Fragment} from 'react';
import * as Sentry from '@sentry/nextjs';
import type {Metadata} from 'next';

import List from 'sentry-docs/components/changelog/list';

import Header from './header';

const getChangelogs = async () => {
  // If CI we return nothing so prerendering doesn't error when calling an internal route
  if (process.env.CI) {
    return [];
  }
  const result = await fetch(
    `${process.env.BASE_URL || `https://${process.env.VERCEL_URL}` || 'https://localhost:3000'}/changelog/api`,
    {
      next: {tags: ['changelogs']},
    }
  );
  if (result.ok) {
    return result.json();
  }
  return [];
};

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
