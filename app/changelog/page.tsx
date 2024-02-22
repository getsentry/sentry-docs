import {Fragment, Suspense} from 'react';
import * as Sentry from '@sentry/nextjs';
import type {Metadata} from 'next';
import Link from 'next/link';

import Article from 'sentry-docs/components/changelog/article';
import List from 'sentry-docs/components/changelog/list';
import Months from 'sentry-docs/components/changelog/months';
import Pagination from 'sentry-docs/components/changelog/pagination';
import Search from 'sentry-docs/components/changelog/search';
import Tags from 'sentry-docs/components/changelog/tags';
import {prisma} from 'sentry-docs/prisma';

import Header from './header';

const ENTRIES_PER_PAGE = 10;

export default async function ChangelogList({
  searchParams,
}: {
  searchParams?: {
    before?: string;
    page?: string;
    query?: string;
    tags?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const selectedCategories = searchParams?.tags?.split(',') || [];
  const before = searchParams?.before || '';

  const filtered = query || selectedCategories.length || before;

  const categoryOR: any = [];
  if (selectedCategories.length) {
    categoryOR.push({
      name: {
        in: selectedCategories,
      },
    });
  }
  if (query) {
    categoryOR.push({
      name: {
        contains: query,
      },
    });
  }

  const matchingCategories = await prisma.category.findMany({
    where: {
      OR: categoryOR,
    },
  });
  const matchingCategoryIds = matchingCategories.map(category => category.id);

  const changelogOR: any = [];
  if (selectedCategories.length) {
    changelogOR.push({categories: {some: {id: {in: matchingCategoryIds}}}});
  }
  if (query) {
    changelogOR.push({title: {contains: query}});
    changelogOR.push({summary: {contains: query}});
    changelogOR.push({content: {contains: query}});
  }

  const where: any = {
    published: true,
  };
  if (before) {
    const date = new Date(Date.parse(`${before}`));
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    where.publishedAt = {
      lte: date,
    };
  }
  if (changelogOR.length) {
    where.OR = changelogOR;
  }

  const totalCount = await prisma.changelog.count({where});
  const categories = await prisma.category.findMany();
  const changelogs = await prisma.changelog.findMany({
    include: {
      categories: true,
    },
    where,
    orderBy: {
      publishedAt: 'desc',
    },
    skip: (currentPage - 1) * ENTRIES_PER_PAGE,
    take: 10,
  });

  const reduceMoths = (changelog: any) => {
    return changelog.reduce((allMonths: any, post: any) => {
      const date = post.publishedAt as Date;
      const year = date.getFullYear();
      const month = date.toLocaleString('default', {
        month: 'long',
      });
      const monthYear = `${month} ${year}`;
      return [...new Set([...allMonths, monthYear])];
    }, []);
  };

  // iterate over all posts and create a list of months & years
  const months = reduceMoths(changelogs);

  const allMonths = reduceMoths(
    await prisma.changelog.findMany({
      select: {publishedAt: true},
      orderBy: {
        publishedAt: 'desc',
      },
    })
  );

  const pagination = {
    currentPage,
    totalPages: totalCount / ENTRIES_PER_PAGE,
  };

  return (
    <Fragment>
      <Header loading={false} />
      <div className="w-full mx-auto grid grid-cols-12 bg-gray-200">
        <div className="hidden md:block md:col-span-2 pl-5 pt-10">
          <h3 className="text-2xl text-primary font-semibold mb-2">Categories:</h3>
          <div className="flex flex-wrap gap-1 py-1">
            <Suspense key={query + searchParams}>
              <Tags categories={categories} />
            </Suspense>
          </div>
        </div>
        <div className="col-span-12 md:col-span-8">
          <div className="max-w-3xl mx-auto px-4 pb-4 sm:px-6 md:px-8">
            <div className="flex justify-between items-center py-6 space-x-4">
              <Search placeholder="Search..." />
              <div className="flex space-x-4">
                <Link
                  className={`${filtered ? 'text-purple font-medium' : 'text-gray-500'} hover:text-gray-700`}
                  href="/changelog/"
                >
                  Reset
                </Link>
              </div>
            </div>

            <Suspense
              fallback={
                <Fragment>
                  <Article loading />
                </Fragment>
              }
              key={query + searchParams + months + pagination}
            >
              <List changelogs={changelogs} />
              {pagination && pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                />
              )}
            </Suspense>

            {!changelogs.length && (
              <div className="flex items-center my-4">
                <div className="flex-1 border-t-[1px] border-gray-400" />
                <span className="px-3 text-gray-500">No posts found.</span>
                <div className="flex-1 border-t-[1px] border-gray-400" />
              </div>
            )}
          </div>
        </div>
        <div className="hidden md:block md:col-span-2 pl-5 pt-10">
          <Suspense key={query + searchParams}>
            <Months months={allMonths} />
          </Suspense>
        </div>
      </div>
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
