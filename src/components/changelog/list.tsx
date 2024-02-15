'use client';

import {Fragment} from 'react';
import {type Category, type Changelog} from '@prisma/client';
import Link from 'next/link';

import Article from './article';

type ChangelogWithCategories = Changelog & {
  categories: Category[];
};

export default function Changelogs({
  changelogs,
}: {
  changelogs: ChangelogWithCategories[];
}) {
  // iterate over all posts and create a list of months & years
  const months = changelogs.reduce((allMonths: any, post: any) => {
    const date = post.publishedAt as Date;
    const year = date.getFullYear();
    const month = date.toLocaleString('default', {
      month: 'long',
    });
    const dateMonthYear = `${month} ${year}`;
    return [...new Set([...allMonths, dateMonthYear])];
  }, []);

  return changelogs.map(changelog => {
    // if month & year of the post match an entry in the months array, pop it from months array and display it
    const monthYear = (changelog.publishedAt as Date).toLocaleString('default', {
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
      <Fragment key={changelog.id}>
        {monthYearIndex > -1 && monthSeparator}
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
            {changelog.summary}
          </Article>
        </Link>
      </Fragment>
    );
  });
}
