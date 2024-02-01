import {Fragment, Suspense} from 'react';
import {type Category, type Changelog} from '@prisma/client';
import * as Sentry from '@sentry/nextjs';
import type {Metadata, ResolvingMetadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {MDXRemote} from 'next-mdx-remote/rsc';

import Article from 'sentry-docs/components/changelog/article';
import {mdxComponents} from 'sentry-docs/mdxComponents';
import {mdxOptions} from 'sentry-docs/mdxOptions';
import {prisma} from 'sentry-docs/prisma';

type ChangelogWithCategories = Changelog & {
  categories: Category[];
};

type Props = {
  params: {slug: string};
};

export async function generateMetadata(
  {params}: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  let changelog: Changelog | null = null;
  try {
    changelog = await prisma.changelog.findUnique({
      where: {
        slug: params.slug,
      },
    });
  } catch (e) {
    return {title: (await parent).title};
  }

  return {
    title: changelog?.title,
    description: changelog?.summary,
    openGraph: {
      images: changelog?.image || (await parent).openGraph?.images,
    },
    other: {
      'sentry-trace': Sentry.getActiveSpan()?.toTraceparent(),
    },
  };
}

export default async function ChangelogEntry({params}) {
  let changelog: ChangelogWithCategories | null = null;
  try {
    changelog = await prisma.changelog.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        categories: true,
      },
    });
  } catch (e) {
    if (e.code === 'ENOENT') {
      return notFound();
    }
    throw e;
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
            <div className="flex space-x-4">
              <Link className="text-gray-500 hover:text-gray-700" href="#">
                Twitter
              </Link>
            </div>
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
                components={mdxComponents}
              />
            </Suspense>
          </Article>
        </div>
      </div>
    </div>
  );
}
