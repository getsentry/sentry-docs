import Image from 'next/image';

import List from 'sentry-docs/components/changelog/list';
import {Navbar} from 'sentry-docs/components/changelog/navbar';
import {getAllFilesFrontMatter} from 'sentry-docs/mdx';

import Layout from './layout';

const ENTRIES_PER_PAGE = 10;

export default async function ChangelogList({searchParams}) {
  const posts = await getAllFilesFrontMatter('changelog');

  posts.sort((a, b) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    return bDate.getTime() - aDate.getTime();
  });

  const totalPages = Math.ceil(posts.length / ENTRIES_PER_PAGE);
  const pageNumber = Math.min(Math.abs(parseInt(searchParams.page, 10)) || 1, totalPages);

  const initialDisplayPosts = posts.slice(
    ENTRIES_PER_PAGE * (pageNumber - 1),
    ENTRIES_PER_PAGE * pageNumber
  );

  const pagination = {
    currentPage: pageNumber,
    totalPages,
  };

  return (
    <Layout>
      <Navbar />
      <div className="w-full mx-auto h-96 relative  bg-darkPurple">
        <div className="hero-top absolute -top-1 w-full h-10 bg-white" />
        <div className="relative w-full lg:max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-12 items-center">
          <Image
            className="justify-self-center col-span-10 z-20 hidden lg:block"
            src="/changelog/assets/hero.png"
            alt="Sentry Changelog"
            height={400}
            width={450}
          />
          <div className="relative col-span-12 mt-32 lg:absolute lg:w-96 lg:right-1/4 lg:-bottom-10">
            <h1 className="justify-self-center text-white font-bold text-4xl text-center lg:text-left">
              Sentry Changelog
            </h1>
            <h2 className="justify-self-center z-20 text-gold text-1xl text-center lg:text-left">
              Stay up to date on everything big and small, from product updates to SDK
              changes with the Sentry Changelog.
            </h2>
          </div>
        </div>
        <div className="hero-bottom absolute bottom-0 w-full h-10 bg-gray-200" />
      </div>
      <List
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </Layout>
  );
}
