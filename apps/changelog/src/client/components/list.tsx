'use client';

import type {Category} from '@prisma/client';
import {MDXRemote, MDXRemoteSerializeResult} from 'next-mdx-remote';
import Link from 'next/link';
import {parseAsArrayOf, parseAsInteger, parseAsString, useQueryState} from 'nuqs';
import {Fragment, useState} from 'react';
import {Article} from './article';
import {Pagination} from './pagination';
import {CategoryTag} from './tag';

const ENTRIES_PER_PAGE = 10;

export type ChangelogEntry = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  image?: string | null | undefined;
  publishedAt: string; // Dates are passed to client components serialized as strings
  categories: Category[];
  mdxSummary: MDXRemoteSerializeResult;
};

/**
 * Turns a date into this format: "August 2024"
 * Which is the format we use in query params and to filter.
 */
function changelogEntryPublishDateToAddressableTag(date: Date) {
  return date.toLocaleString('en-EN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function ChangelogList({changelogs}: {changelogs: ChangelogEntry[]}) {
  const [searchValue, setSearchValue] = useState<string | null>('');
  const [, setQuerySearchValue] = useQueryState('search', parseAsString);

  const [monthAndYearParam, setMonthParam] = useQueryState('month');
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useQueryState(
    'categories',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({clearOnDefault: true})
  );
  const [pageParam, setPageParam] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({clearOnDefault: true})
  );

  const selectedPage = pageParam === null ? 1 : pageParam;

  const someFilterIsActive = Boolean(
    selectedCategoriesIds.length > 0 || searchValue || monthAndYearParam
  );

  const filteredChangelogsWithoutMonthFilter = changelogs
    // First filter by categories
    .filter(changelog => {
      if (selectedCategoriesIds.length === 0) {
        // If no categories are selected we don't filter anything
        return true;
      }

      return changelog.categories.some(changelogCategory =>
        selectedCategoriesIds.includes(changelogCategory.id)
      );
    })

    .filter(changelog => {
      if (searchValue === null) {
        return true;
      }

      const addressableDate = changelogEntryPublishDateToAddressableTag(
        new Date(changelog.publishedAt)
      );

      // map all categories to a string
      const concatenatedCategories = changelog.categories
        .map((category: Category) => category.name)
        .join(' ');

      const searchableContent =
        changelog.title + changelog.summary + concatenatedCategories + addressableDate;

      return searchableContent.toLowerCase().includes(searchValue.toLowerCase());
    })
    .sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  const filteredChangelogs = filteredChangelogsWithoutMonthFilter
    // Filter by selected date
    .filter(changelog => {
      if (monthAndYearParam == null) {
        // If no date was selected we don't filter anything
        return true;
      }

      const addressableDate = changelogEntryPublishDateToAddressableTag(
        new Date(changelog.publishedAt)
      );

      return monthAndYearParam === addressableDate;
    });

  const allChangelogCategories: Record<string, Category> = {};
  changelogs.forEach(changelog => {
    changelog.categories.forEach(category => {
      allChangelogCategories[category.id] = category;
    });
  });

  // contains dates in the format "August 2024"
  const datesGroupedByMonthAndYear = new Set<string>();
  changelogs.forEach(changelog => {
    if (changelog.publishedAt === null) {
      throw new Error('invariant');
    }

    datesGroupedByMonthAndYear.add(
      changelogEntryPublishDateToAddressableTag(new Date(changelog.publishedAt))
    );
  });

  const sortedDatesGroupedByMonthAndYear = [...datesGroupedByMonthAndYear].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const paginatedChangelogs = filteredChangelogs
    .slice(ENTRIES_PER_PAGE * (selectedPage - 1), ENTRIES_PER_PAGE * selectedPage)
    .map((changelog, i, arr) => {
      const monthYear = changelogEntryPublishDateToAddressableTag(
        new Date(changelog.publishedAt)
      );

      const prevChangelog: ChangelogEntry | undefined = arr[i - 1];
      const prevChangelogHasDifferentMonth =
        !prevChangelog ||
        changelogEntryPublishDateToAddressableTag(new Date(prevChangelog.publishedAt)) !==
          changelogEntryPublishDateToAddressableTag(new Date(changelog.publishedAt));

      return (
        <Fragment key={changelog.id}>
          {prevChangelogHasDifferentMonth && (
            <div className="flex items-center my-4">
              <div className="flex-1 border-t-[1px] border-gray-400" />
              <span className="px-3 text-gray-500">{monthYear}</span>
              <div className="flex-1 border-t-[1px] border-gray-400" />
            </div>
          )}
          <Link href={`/changelog/${changelog.slug}`}>
            <Article
              className="fancy-border"
              key={changelog.id}
              slug={changelog.slug}
              date={changelog.publishedAt}
              title={changelog.title}
              tags={changelog.categories.map((category: Category) => category.name)}
              image={changelog.image}
            >
              <MDXRemote {...changelog.mdxSummary} />
            </Article>
          </Link>
        </Fragment>
      );
    });

  const numberOfPages = Math.ceil(filteredChangelogs.length / ENTRIES_PER_PAGE);

  return (
    <div className="w-full mx-auto grid grid-cols-12 bg-gray-200">
      <div className="hidden md:block md:col-span-2 pl-5 pt-10">
        <h3 className="text-2xl text-primary font-semibold mb-2">Categories:</h3>
        <div className="flex flex-wrap gap-1 py-1">
          {Object.values(allChangelogCategories).map(category => {
            return (
              <CategoryTag
                onClick={e => {
                  e.preventDefault();
                  if (selectedCategoriesIds.includes(category.id)) {
                    const newSelectedCategoriesIds = selectedCategoriesIds.filter(
                      cat => cat !== category.id
                    );
                    setSelectedCategoriesIds(newSelectedCategoriesIds);
                    setPageParam(null);
                  } else {
                    setSelectedCategoriesIds([...selectedCategoriesIds, category.id]);
                    setPageParam(null);
                  }
                }}
                text={category.name}
                active={selectedCategoriesIds.includes(category.id)}
                pointer
                key={category.name}
              />
            );
          })}
        </div>
      </div>
      <div className="col-span-12 md:col-span-8">
        <div className="max-w-3xl mx-auto px-4 pb-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center py-6 space-x-4">
            <input
              aria-label="Search..."
              type="text"
              value={searchValue ?? ''}
              onChange={e => {
                setPageParam(null);
                const newSearchValue = e.target.value ? e.target.value : null;
                setSearchValue(newSearchValue);
                setQuerySearchValue(newSearchValue);
              }}
              placeholder="Search..."
              className="form-input flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
            />
            <div className="flex space-x-4">
              <a
                className={`${someFilterIsActive ? 'text-purple font-medium cursor-pointer' : 'text-gray-500 cursor-not-allowed'} hover:text-gray-700`}
                onClick={() => {
                  setSearchValue(null);
                  setQuerySearchValue(null);
                  setSelectedCategoriesIds(null);
                  setMonthParam(null);
                  setPageParam(null);
                }}
              >
                Reset
              </a>
            </div>
          </div>

          {paginatedChangelogs}

          {numberOfPages > 1 && (
            <Pagination
              currentPage={selectedPage}
              totalPages={numberOfPages}
              onPageNumberChange={pageNumber => {
                setPageParam(pageNumber, {history: 'push'});
              }}
              search={searchValue}
              selectedMonth={monthAndYearParam}
              selectedCategoriesIds={selectedCategoriesIds}
            />
          )}

          {paginatedChangelogs.length === 0 && (
            <div className="flex items-center my-4">
              <div className="flex-1 border-t-[1px] border-gray-400" />
              <span className="px-3 text-gray-500">No posts found.</span>
              <div className="flex-1 border-t-[1px] border-gray-400" />
            </div>
          )}
        </div>
      </div>
      <div className="hidden md:block md:col-span-2 pl-5 pt-10">
        <h3 className="text-1xl text-primary font-semibold mb-2">Jump to:</h3>
        <ul>
          {sortedDatesGroupedByMonthAndYear
            .filter(monthAndYear => {
              return filteredChangelogsWithoutMonthFilter.some(changelog => {
                return (
                  changelogEntryPublishDateToAddressableTag(
                    new Date(changelog.publishedAt)
                  ) === monthAndYear
                );
              });
            })
            .map((monthAndYear, index) => (
              <li key={index}>
                <a
                  className={`text-primary cursor-pointer hover:text-purple-900 hover:font-extrabold ${monthAndYearParam === monthAndYear ? 'underline' : ''}`}
                  onClick={e => {
                    e.preventDefault();
                    if (monthAndYearParam === monthAndYear) {
                      setMonthParam(null);
                      setPageParam(null);
                    } else {
                      setMonthParam(monthAndYear);
                      setPageParam(null);
                    }
                  }}
                >
                  {monthAndYear}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
