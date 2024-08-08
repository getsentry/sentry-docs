import {Fragment} from 'react';
import type {Metadata} from 'next';
import {serialize} from 'next-mdx-remote/serialize';

import Header from './header';
import {getChangelogs} from '../../server/utils';
import {ChangelogEntry, ChangelogList} from '@/client/components/list';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const changelogs = await getChangelogs();

  const changelogsWithMdxSummaries = await Promise.all(
    changelogs
      .filter(changelog => {
        return changelog.publishedAt !== null;
      })
      .map(async (changelog): Promise<ChangelogEntry> => {
        const mdxSummary = await serialize(changelog.summary || '');
        return {
          id: changelog.id,
          title: changelog.title,
          slug: changelog.slug,
          // Because `getChangelogs` is cached, it sometimes returns its results serialized and sometimes not. Therefore we have to deserialize the string to be able to call toUTCString().
          publishedAt: new Date(changelog.publishedAt!).toUTCString(),
          categories: changelog.categories,
          mdxSummary,
        };
      })
  );

  return (
    <Fragment>
      <Header />
      <ChangelogList changelogs={changelogsWithMdxSummaries} />
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
