'use client';

import {useEffect, useState} from 'react';
import {type Category, type Changelog} from '@prisma/client';
import Link from 'next/link';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';

import Article from 'sentry-docs/components/changelog/article';
import Pagination from 'sentry-docs/components/changelog/pagination';
import Tag from 'sentry-docs/components/changelog/tag';

const ENTRIES_PER_PAGE = 10;

type ChangelogWithCategories = Changelog & {
  categories: Category[];
};

export default function Changelogs({
  changelogs,
}: {
  changelogs: ChangelogWithCategories[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pageNumber, setPageNumber] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<string[]>(
    searchParams?.get('categories')?.split(',') || []
  );
  const [selectedMonth, setSelectedMonth] = useState<string | null>(
    searchParams?.get('month') || null
  );

  useEffect(() => {
    const params: string[] = [];
    if (selectedCategoriesIds.length > 0) {
      params.push(`categories=${selectedCategoriesIds.join(',')}`);
    }
    if (selectedMonth) {
      params.push(`month=${selectedMonth}`);
    }
    router.push(pathname + '?' + params.join('&'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoriesIds, selectedMonth]);

  const filtered = selectedCategoriesIds.length || searchValue || selectedMonth;

  const filteredChangelogs = changelogs
    .filter((changelog: ChangelogWithCategories) => {
      // map all categories to a string
      const categories = changelog.categories
        .map((category: Category) => category.name)
        .join(' ');

      const postDate = new Date(changelog.publishedAt || '');
      const postMonthYear = postDate.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });

      const searchContent = changelog.title + changelog.summary + categories;
      return (
        searchContent.toLowerCase().includes(searchValue.toLowerCase()) &&
        (!selectedCategoriesIds.length ||
          selectedCategoriesIds.some(catId =>
            changelog.categories.some(changelogCategory => changelogCategory.id === catId)
          )) &&
        (!selectedMonth || selectedMonth === postMonthYear)
      );
    })
    .slice(ENTRIES_PER_PAGE * (pageNumber - 1), ENTRIES_PER_PAGE * pageNumber);

  const allChangelogCategories: Record<string, Category> = {};
  changelogs.forEach(changelog => {
    changelog.categories.forEach(category => {
      allChangelogCategories[category.id] = category;
    });
  });

  // iterate over all posts and create a list of months & years
  const months = changelogs.reduce((allMonths, post) => {
    // if no date is set, use the epoch (simulate behavior before this refactor)
    const date = post.publishedAt instanceof Date ? post.publishedAt : new Date(0);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', {
      month: 'long',
    });
    const dateMonthYear = `${month} ${year}`;
    return [...new Set([...allMonths, dateMonthYear])];
  }, [] as string[]);

  const monthsCopy = [...months];

  const showChangelogs = filteredChangelogs.map(changelog => {
    const monthYear = new Date(changelog.publishedAt || '').toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });

    const monthYearIndex = months.indexOf(monthYear);
    if (monthYearIndex > -1) {
      // remove first entry from months array
      months.splice(monthYearIndex, 1);
    }

    const monthSeparator = (
      <div className="flex items-center my-4">
        <div className="flex-1 border-t-[1px] border-gray-400" />
        <span className="px-3 text-gray-500">{monthYear}</span>
        <div className="flex-1 border-t-[1px] border-gray-400" />
      </div>
    );

    return (
      <Link href={`/changelog/${changelog.slug}`} key={changelog.id}>
        {monthYearIndex > -1 && monthSeparator}
        <Article
          className="fancy-border"
          key={changelog.id}
          slug={changelog.slug}
          date={changelog.publishedAt}
          title={changelog.title}
          tags={changelog.categories.map((category: Category) => category.name)}
          image={changelog.image}
        >
          {changelog.summary}
        </Article>
      </Link>
    );
  });

  const pagination = {
    totalPages: Math.ceil(
      (filtered ? filteredChangelogs.length : changelogs.length) / ENTRIES_PER_PAGE
    ),
  };

  return (
    <div className="w-full mx-auto grid grid-cols-12 bg-gray-200">
      <div className="hidden md:block md:col-span-2 pl-5 pt-10">
        <h3 className="text-2xl text-primary font-semibold mb-2">Categories:</h3>
        <div className="flex flex-wrap gap-1 py-1">
          {Object.values(allChangelogCategories).map(category => {
            return (
              <a
                onClick={() => {
                  if (selectedCategoriesIds.includes(category.id)) {
                    setSelectedCategoriesIds(
                      selectedCategoriesIds.filter(cat => cat !== category.id)
                    );
                  } else {
                    setSelectedCategoriesIds([...selectedCategoriesIds, category.id]);
                  }
                }}
                key={category.name}
              >
                <Tag
                  text={category.name}
                  active={selectedCategoriesIds.includes(category.id)}
                  pointer
                />
              </a>
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
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="Search..."
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
            />
            <div className="flex space-x-4">
              <a
                className={`${filtered ? 'text-purple font-medium cursor-pointer' : 'text-gray-500 cursor-not-allowed'} hover:text-gray-700`}
                onClick={() => {
                  setSearchValue('');
                  setSelectedCategoriesIds([]);
                  setSelectedMonth(null);
                }}
              >
                Reset
              </a>
            </div>
          </div>

          {showChangelogs}

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pageNumber}
              totalPages={pagination.totalPages}
              setPageNumber={setPageNumber}
            />
          )}

          {!filteredChangelogs.length && (
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
          {monthsCopy.map((month, index) => (
            <li key={index}>
              <a
                className={`text-primary hover:text-purple-900 hover:font-extrabold ${selectedMonth === month ? 'underline' : ''}`}
                onClick={e => {
                  e.preventDefault();
                  if (selectedMonth === month) {
                    setSelectedMonth(null);
                  } else {
                    setSelectedMonth(month);
                  }
                }}
              >
                {month}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
