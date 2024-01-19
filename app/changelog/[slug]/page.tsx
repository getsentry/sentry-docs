import Layout from '../layout';
import {Navbar} from 'sentry-docs/components/changelog/navbar';
import Article from 'sentry-docs/components/changelog/article';
import {getMDXComponent} from 'mdx-bundler/client';
import {getFileBySlug} from 'sentry-docs/mdx';
import {notFound} from 'next/navigation';
import {useMemo} from 'react';
import Link from 'next/link';
import { mdxComponents } from "sentry-docs/mdxComponents";

const MDXLayoutRenderer = ({mdxSource, ...rest}) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);
  return <MDXLayout  components={mdxComponents()} {...rest} />;
};

export default async function ChangelogEntry({params}) {
  let entry: any = null;
  try {
    entry = await getFileBySlug(`changelog/${params.slug}`);
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error('ENOENT', params.slug);
      return notFound();
    } else {
      throw e;
    }
  }
  const {mdxSource, toc, frontMatter} = entry;

  return (
    <Layout>
      <Navbar />
      <div className="max-w-4xl mx-auto pt-4">
      <button
        className="flex items-center gap-2 px-6 py-3 font-bold text-center text-primary uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20"
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
        <Link href={`/changelog/`}>Back</Link>
      </button>
      </div>
      <div className="max-w-3xl mx-auto px-4 p-4 sm:px-6 lg:px-8">
        <Article {...frontMatter}>
          <MDXLayoutRenderer toc={toc} mdxSource={mdxSource} frontMatter={frontMatter} />
        </Article>
      </div>
    </Layout>
  );
}
