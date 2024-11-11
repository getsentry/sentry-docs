import {Fragment} from 'react';
import type {Metadata} from 'next';
import {serialize} from 'next-mdx-remote/serialize';

import Header from './header';
import {getChangelogs} from '../../server/utils';
import {ChangelogEntry, ChangelogList} from '@/client/components/list';
import {startSpan} from '@sentry/nextjs';
import type {Plugin} from 'unified';
import {visit} from 'unist-util-visit';
import {Element} from 'hast';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const changelogs = await getChangelogs();

  const changelogsWithPublishedAt = changelogs.filter(changelog => {
    return changelog.publishedAt !== null;
  });

  const changelogsWithMdxSummaries = await startSpan(
    {name: 'serialize changelog summaries'},
    () =>
      Promise.all(
        changelogsWithPublishedAt.map(async (changelog): Promise<ChangelogEntry> => {
          const mdxSummary = await serialize(
            changelog.summary || '',
            {
              mdxOptions: {
                rehypePlugins: [
                  // Because we render the changelog entries as <a> tags, and it is not allowed to render <a> tags
                  // within other a tags, we need to strip away the <a> tags inside the previews here.
                  // @ts-ignore
                  stripLinks,
                ],
              },
            },
            true
          );
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
      )
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

const stripLinks: Plugin = () => {
  return tree => {
    return visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'a') {
        node.tagName = 'span';
        if (node.properties) {
          delete node.properties.href;
          delete node.properties.class;
        }
      }
    });
  };
};
