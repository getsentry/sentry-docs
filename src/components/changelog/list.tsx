'use client';

import {Fragment, useState} from 'react';
import Link from 'next/link';

import type {FrontMatter} from 'sentry-docs/mdx';

import Article from './article';
import Pagination from './pagination';

export default function ListLayout({
  pagination,
  posts,
  initialDisplayPosts = [],
}: {
  pagination: any;
  posts: any;
  title: any;
  initialDisplayPosts?: FrontMatter[] | undefined;
}) {
  const [searchValue, setSearchValue] = useState('');
  const filteredBlogPosts = posts.filter(frontMatter => {
    let tags = '';
    if (Array.isArray(frontMatter.tags)) {
      tags = frontMatter.tags.join(' ');
    }
    const searchContent = frontMatter.title + frontMatter.summary + tags;
    return searchContent.toLowerCase().includes(searchValue.toLowerCase());
  });

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue
      ? initialDisplayPosts
      : filteredBlogPosts;

  return (
    <Fragment>
      <div className="max-w-3xl mx-auto px-4 pb-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6 space-x-4">
          <input
            aria-label="Search announcements"
            type="text"
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Search announcements"
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
          />
          <div className="flex space-x-4">
            <Link className="text-gray-500 hover:text-gray-700" href="#">
              Twitter
            </Link>
          </div>
        </div>

        {!filteredBlogPosts.length && 'No posts found.'}
        {displayPosts.map(frontMatter => {
          const {slug, date, title, summary, tags, image} = frontMatter;
          return (
            <Link href={`/changelog/${slug}`} key={slug}>
              <Article
                className="fancy-border"
                key={slug}
                slug={slug}
                date={date}
                title={title}
                tags={tags}
                image={image}
              >
                {summary}
              </Article>
            </Link>
          );
        })}

        {pagination && pagination.totalPages > 1 && !searchValue && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
          />
        )}
      </div>
    </Fragment>
  );
}
