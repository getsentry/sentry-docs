import { useMemo } from "react";
import { getAllFilesFrontMatter, getFileBySlug } from "sentry-docs/mdx";
import { getMDXComponent } from 'mdx-bundler/client';
import Link from "next/link";
import { PageGrid } from "sentry-docs/components/pageGrid";

export async function generateStaticParams() {
    const docs = await getAllFilesFrontMatter();
    return docs.map((doc) => ({ path: doc.slug.split('/').slice(1) }));
}

const MDXComponents = {
  PageGrid,
  a: Link,
  wrapper: ({ components, ...rest }) => {
    return <Layout {...rest} />;
  }
}

const Layout = ({children, frontMatter}) => {
  return (
  <>
  <h1>{frontMatter.title}</h1>
  {children}
  </>
  );
}

const MDXLayoutRenderer = ({ mdxSource, ...rest }) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])
  return <MDXLayout components={MDXComponents} {...rest} />;
}

export default async function Page({ params }) {
  // get frontmatter of all docs in tree
  const docs = await getAllFilesFrontMatter();
  
  // get the MDX for the current doc and render it
  const slug = params.path
    ? ['contributing', ...params.path].join('/')
    : 'contributing';
  const doc = await getFileBySlug(slug);
  const { mdxSource, toc, frontMatter } = doc;
  
  // pass frontmatter tree into sidebar, rendered page + fm into middle, headers into toc
  return (
    <MDXLayoutRenderer
      toc={toc}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
      />
  );
  
  // return (
  //   <>
  //       <h1>{doc.frontMatter.title}</h1>
  //       <ul>
  //           {
  //           docs.map((doc) => <li key={doc.slug}>{doc.title} ({doc.slug})</li>)
  //           }
  //       </ul>
  //   </>
  // )
}
