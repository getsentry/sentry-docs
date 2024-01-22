'use client';

import {Fragment, useState} from 'react';
import Link from 'next/link';

import type {FrontMatter} from 'sentry-docs/mdx';

import Article from './article';
import Pagination from './pagination';
import Tag from './tag';

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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const filteredBlogPosts = posts.filter(frontMatter => {
    let tags = '';
    if (Array.isArray(frontMatter.tags)) {
      tags = frontMatter.tags.join(' ');
    }
    const postDate = new Date(frontMatter.date);
    const postMonthYear = postDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });

    const searchContent = frontMatter.title + frontMatter.summary + tags;
    return (
      searchContent.toLowerCase().includes(searchValue.toLowerCase()) &&
      (!selectedTags.length ||
        selectedTags.some(tag => frontMatter.tags?.includes(tag))) &&
      (!selectedMonth || selectedMonth === postMonthYear)
    );
  });

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 &&
    !searchValue &&
    !selectedTags.length &&
    !selectedMonth
      ? initialDisplayPosts
      : filteredBlogPosts;

  // iterate over all posts and create a list of months & years
  const months = posts.reduce((allMonths: any, post: any) => {
    const date = new Date(post.date);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', {
      month: 'long',
    });
    const monthYear = `${month} ${year}`;
    return [...new Set([...allMonths, monthYear])];
  }, []);

  const monthsCopy = [...months];

  // iterate over all posts and create a list of tags
  const allPostTags = posts.reduce((allTags: any, post: any) => {
    return [...new Set([...allTags, ...(post.tags || [])])];
  }, []);

  return (
    <div className="w-full mx-auto grid grid-cols-12 bg-gray-200">
      <div className="hidden md:block md:col-span-2 pl-5 pt-10">
        <h3 className="text-2xl text-primary font-semibold mb-2">Categories:</h3>
        <div className="flex flex-wrap gap-1 py-1">
          {Array.isArray(allPostTags) &&
            allPostTags.map(tag => {
              return (
                <a
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }
                  }}
                  key={tag}
                >
                  <Tag text={tag} active={selectedTags.includes(tag)} pointer />
                </a>
              );
            })}
        </div>
      </div>
      <div className="col-span-12 md:col-span-8">
        <div className="max-w-3xl mx-auto px-4 pb-4 sm:px-6 md:px-8">
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

          {!filteredBlogPosts.length && (
            <div className="flex items-center my-4">
              <div className="flex-1 border-t-[1px] border-gray-400" />
              <span className="px-3 text-gray-500">No posts found.</span>
              <div className="flex-1 border-t-[1px] border-gray-400" />
            </div>
          )}

          {displayPosts.map(frontMatter => {
            const {slug, date, title, summary, tags, image} = frontMatter;
            // if month & year of the post match an entry in the months array, pop it from months array and display it
            const monthYear = new Date(date).toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            });

            const monthYearIndex = months.indexOf(monthYear);
            months.splice(monthYearIndex, 1);

            const monthSeparator = (
              <div className="flex items-center my-4">
                <div className="flex-1 border-t-[1px] border-gray-400" />
                <span className="px-3 text-gray-500">{monthYear}</span>
                <div className="flex-1 border-t-[1px] border-gray-400" />
              </div>
            );

            return (
              <Fragment key={slug}>
                {monthYearIndex > -1 && monthSeparator}
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
              </Fragment>
            );
          })}

          {pagination && pagination.totalPages > 1 && !searchValue && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
            />
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
                href={`#${month}`}
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
