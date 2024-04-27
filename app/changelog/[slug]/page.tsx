import {Fragment, Suspense} from 'react';
import {type Category, type Changelog} from '@prisma/client';
import {GET as sessionHandler} from 'app/api/auth/[...nextauth]/route';
import type {Metadata, ResolvingMetadata} from 'next';
import {unstable_cache} from 'next/cache';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getServerSession} from 'next-auth/next';
import {MDXRemote} from 'next-mdx-remote/rsc';

import Article from 'sentry-docs/components/changelog/article';
import {mdxOptions} from 'sentry-docs/mdxOptions';
import prisma from 'sentry-docs/prisma';

type ChangelogWithCategories = Changelog & {
  categories: Category[];
};

export async function generateMetadata(
  {params},
  parent: ResolvingMetadata
): Promise<Metadata> {
  let changelog: Changelog | null = null;
  try {
    changelog = await getChangelog(params.slug);
  } catch (e) {
    return {title: (await parent).title};
  }

  return {
    title: changelog?.title,
    description: changelog?.summary,
    alternates: {
      canonical: `https://sentry.io/changelog/${params.slug}`,
    },
    openGraph: {
      images: changelog?.image || (await parent).openGraph?.images,
    },
  };
}

const getChangelog = unstable_cache(
  async slug => {
    const session = await getServerSession(sessionHandler);
    let published: boolean | undefined = undefined;
    if (!session) {
      published = true;
    }
    try {
      return await prisma.changelog.findUnique({
        where: {
          slug,
          published,
        },
        include: {
          categories: true,
        },
      });
    } catch (e) {
      return null;
    }
  },
  ['changelog-detail'],
  {tags: ['changelog-detail']}
);

export default async function ChangelogEntry({params}) {
  const changelog: ChangelogWithCategories | null = await getChangelog(params.slug);

  if (!changelog) {
    return notFound();
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)] w-full mx-auto grid grid-cols-12 bg-gray-200">
      <div className="col-span-12 md:col-start-3 md:col-span-8">
        <div className="max-w-3xl mx-auto px-4 p-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center space-x-4 py-3">
            <Link href="/changelog/">
              <button
                className="flex items-center gap-2 px-6 py-3 font-bold text-center text-primary uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                Back
              </button>
            </Link>
          </div>
          <Article
            title={changelog?.title}
            image={changelog?.image}
            date={changelog?.publishedAt}
          >
            <Suspense fallback={<Fragment>Loading...</Fragment>}>
              <MDXRemote
                source={changelog?.content || 'No content found.'}
                options={{
                  mdxOptions,
                }}
              />
            </Suspense>
          </Article>
        </div>
      </div>
    </div>
  );
}
