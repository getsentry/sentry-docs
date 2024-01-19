"use client";

import type {FrontMatter} from 'sentry-docs/mdx';

import {useState} from 'react';
import Link from 'next/link';
import Tag from './tag';

export default function ListLayout({posts, title, initialDisplayPosts = [], pagination}: {
    posts: any;
    title: any;
    initialDisplayPosts?: FrontMatter[] | undefined;
    pagination: any;
}) {
  const [searchValue, setSearchValue] = useState('');
  const filteredBlogPosts = posts.filter(frontMatter => {
    const searchContent =
      frontMatter.title + frontMatter.summary + frontMatter.tags.join(' ');
    return searchContent.toLowerCase().includes(searchValue.toLowerCase());
  });

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue
      ? initialDisplayPosts
      : filteredBlogPosts;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pb-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <input
            aria-label="Search entries"
            type="text"
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Search entries"
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
          />
          <div className="flex space-x-4">
            <Link className="text-gray-500 hover:text-gray-700" href="#">
              Archive
            </Link>
            <Link className="text-gray-500 hover:text-gray-700" href="#">
              Twitter
            </Link>
            <Link className="text-gray-500 hover:text-gray-700" href="#">
              Feed
            </Link>
          </div>
        </div>

        {!filteredBlogPosts.length && 'No posts found.'}
        {displayPosts.map(frontMatter => {
          const {slug, date, title, summary, tags} = frontMatter;
          return (
            <article key={slug} className="bg-white p-6 rounded-lg shadow-lg mb-8">
              <dl>
                <dt className="sr-only">Published on</dt>
                <dd className="text-xs leading-6 text-gray-500 dark:text-gray-400">
                  {/* <time dateTime={date}>{formatDate(date)}</time> */}
                  <time dateTime={date}>{date}</time>
                </dd>
              </dl>

              <h3 className="text-xl font-semibold mb-2">
                <Link
                  href={`/changelog/${slug}`}
                  className="text-gray-900 dark:text-gray-100"
                >
                  {title}
                </Link>
              </h3>
              <div>
                <div className="flex flex-wrap gap-1 py-1">
                  {tags.map(tag => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>

                <div className="prose max-w-none text-gray-500 py-2">{summary}</div>
              </div>
            </article>
          );
        })}
      </div>
      {/* {pagination && pagination.totalPages > 1 && !searchValue && (
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        )} */}
    </>
  );
}
