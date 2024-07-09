import {Fragment} from 'react';
import type {Metadata} from 'next';
import {serialize} from 'next-mdx-remote/serialize';

import List from 'sentry-docs/components/changelog/list';

import Header from './header';
import {getChangelogs} from './utils';

export const dynamic = 'force-dynamic';

export default async function ChangelogList() {
  const changelogs = await getChangelogs();

  const changelogsWithMdxSummaries = await Promise.all(
    changelogs.map(async changelog => {
      const mdxSummary = await serialize(changelog.summary || '');
      return {
        ...changelog,
        mdxSummary,
      };
    })
  );

  return (
    <Fragment>
      <Header loading={false} />
      <List changelogs={changelogsWithMdxSummaries} />
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
  };
}
