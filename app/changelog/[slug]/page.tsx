
import {Navbar} from 'sentry-docs/components/changelog/navbar';
import {getMDXComponent} from 'mdx-bundler/client';
import {getFileBySlug} from 'sentry-docs/mdx';
import {notFound} from 'next/navigation';
import {useMemo} from 'react';

const mdxComponentsWithWrapper = ({children, frontMatter, toc}) => (
  <Layout children={children} frontMatter={frontMatter} toc={toc} />
);

const MDXLayoutRenderer = ({mdxSource, ...rest}) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);
  return <MDXLayout components={mdxComponentsWithWrapper} {...rest} />;
};

export default async function ChangelogEntry({params}) {
  console.log(params);
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
  <>
      <Navbar />
      <MDXLayoutRenderer toc={toc} mdxSource={mdxSource} frontMatter={frontMatter} />
      </>
  );
}
