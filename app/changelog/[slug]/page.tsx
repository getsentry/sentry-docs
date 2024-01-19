import Layout from '../layout';
import {Navbar} from 'sentry-docs/components/changelog/navbar';
import {getMDXComponent} from 'mdx-bundler/client';
import {getFileBySlug} from 'sentry-docs/mdx';
import {notFound} from 'next/navigation';
import {useMemo} from 'react';

const MDXLayoutRenderer = ({mdxSource, ...rest}) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);
  return <MDXLayout {...rest} />;
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
      <MDXLayoutRenderer toc={toc} mdxSource={mdxSource} frontMatter={frontMatter} />
    </Layout>
  );
}
