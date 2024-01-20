import List from 'sentry-docs/components/changelog/list';
import {Navbar} from 'sentry-docs/components/changelog/navbar';
import {getAllFilesFrontMatter} from 'sentry-docs/mdx';

import Layout from './layout';

const ENTRIES_PER_PAGE = 10;

export default async function ChangelogList({params}) {
  const posts = await getAllFilesFrontMatter('changelog');
  
  posts.sort((a, b) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    return bDate.getTime() - aDate.getTime();
  });
  
  const pageNumber = parseInt(params.page || 0, 10);
  const initialDisplayPosts = posts.slice(
    ENTRIES_PER_PAGE * (pageNumber - 1),
    ENTRIES_PER_PAGE * pageNumber
  );
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / ENTRIES_PER_PAGE),
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
