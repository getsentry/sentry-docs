'use client';

import type {FrontMatter} from 'sentry-docs/mdx';

import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Tag from './tag';
import Date from './date';
import Article from './article';

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: {
  posts: any;
  title: any;
  initialDisplayPosts?: FrontMatter[] | undefined;
  pagination: any;
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
    <>
      <div className="max-w-3xl mx-auto px-4 pb-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6  space-x-4">
          <input
            aria-label="Search announcements"
            type="text"
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Search announcements"
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
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
          const {slug, date, title, summary, tags, image} = frontMatter;
          return (
            <Link href={`/changelog/${slug}`}>
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

        <div className="flex items-center justify-center gap-4">
          <button
            disabled
            className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              aria-hidden="true"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              ></path>
            </svg>
            Previous
          </button>
          <div className="flex items-center gap-2">
            <button
              className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg bg-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                1
              </span>
            </button>
            <button
              className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                2
              </span>
            </button>
            <button
              className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                3
              </span>
            </button>
            <button
              className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                4
              </span>
            </button>
            <button
              className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                5
              </span>
            </button>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              aria-hidden="true"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      {/* {pagination && pagination.totalPages > 1 && !searchValue && (
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        )} */}
    </>
  );
}
