import {Fragment} from 'react';
import * as Sentry from '@sentry/nextjs';
import {GET as changelogsEndpoint} from 'app/changelog/api/route';
import type {Metadata} from 'next';

import List from 'sentry-docs/components/changelog/list';

import Header from './header';

const getChangelogs = async () => {
  if (process.env.CI) {
    // during CI, we invoke the API directly since the endpoint doesn't exist yet
    return (await changelogsEndpoint()).json();
  }
  const result = await fetch(
    `${process.env.BASE_URL || `https://${process.env.VERCEL_URL}` || 'https://localhost:3000'}/changelog/api`,
    {
      cache: 'force-cache',
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
