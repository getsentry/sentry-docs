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
      <List
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </Layout>
  );
}
