import {s} from 'hastscript';
import {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {MDXRemote} from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrismDiff from 'rehype-prism-diff';
import rehypePrismPlus from 'rehype-prism-plus';
// Rehype packages
import rehypeSlug from 'rehype-slug';

import {apiCategories} from 'sentry-docs/build/resolveOpenAPI';
import {ApiCategoryPage} from 'sentry-docs/components/apiCategoryPage';
import {ApiPage} from 'sentry-docs/components/apiPage';
import {DocPage} from 'sentry-docs/components/docPage';
import {Home} from 'sentry-docs/components/home';
import {PlatformContent} from 'sentry-docs/components/platformContent';
import {getDocsRootNode, nodeForPath} from 'sentry-docs/docTree';
import {getDocsFrontMatter, getFileBySlug} from 'sentry-docs/mdx';
import {mdxComponents} from 'sentry-docs/mdxComponents';
// Remark packages
import {remarkCodeTabs} from 'sentry-docs/remark-code-tabs.mjs';
import {remarkCodeTitles} from 'sentry-docs/remark-code-title.mjs';
import remarkComponentSpacing from 'sentry-docs/remark-component-spacing';
import {remarkExtractFrontmatter} from 'sentry-docs/remark-extract-frontmatter.mjs';
import remarkTocHeadings from 'sentry-docs/remark-toc-headings';
import {setServerContext} from 'sentry-docs/serverContext';

export async function generateStaticParams() {
  const docs = await getDocsFrontMatter();
  const paths = docs.map(doc => {
    let path = doc.slug.split('/');
    if (path[path.length - 1] === 'index') {
      path = path.slice(0, path.length - 1);
    }
    return {path};
  });
  paths.push({path: undefined}); // the home page
  return paths;
}

// Only render paths returned by generateStaticParams
export const dynamicParams = false;
export const dynamic = 'force-static';

// const mdxComponentsWithWrapper = mdxComponents(
//   {Include, PlatformContent},
//   ({children, frontMatter}) =>
// );

// function MDXLayoutRenderer({mdxSource, ...rest}) {
//   const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);
//   return <MDXLayout components={mdxComponentsWithWrapper} {...rest} />;
// }

export default async function Page({params}) {
  if (!params.path) {
    return <Home />;
  }

  // get frontmatter of all docs in tree
  const docs = await getDocsFrontMatter();
  const rootNode = await getDocsRootNode();
  if (!rootNode) {
    console.warn('no root node');
    return notFound();
  }

  setServerContext({
    rootNode,
    path: params.path,
  });

  if (params.path[0] === 'api' && params.path.length > 1) {
    const categories = await apiCategories();
    const category = categories.find(c => c.slug === params.path[1]);
    if (category) {
      if (params.path.length === 2) {
        return <ApiCategoryPage category={category} />;
      }
      const api = category.apis.find(a => a.slug === params.path[2]);
      if (api) {
        return <ApiPage api={api} />;
      }
    }
  }

  const pageNode = nodeForPath(rootNode, params.path);
  if (!pageNode) {
    console.warn('no page node', params.path);
    return notFound();
  }

  // get the MDX for the current doc and render it
  let doc: Awaited<ReturnType<typeof getFileBySlug>>;
  try {
    doc = await getFileBySlug(`docs/${pageNode.path}`);
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error('ENOENT', pageNode.path);
      return notFound();
    }
    throw e;
  }

  const mdxOptions = {
    remarkPlugins: [
      remarkExtractFrontmatter,
      [remarkTocHeadings, {exportRef: []}],
      // remarkGfm,
      // remarkCodeTitles,
      // remarkCodeTabs,
      remarkComponentSpacing,
      // [
      //   remarkVariables,
      //   {
      //     resolveScopeData: async () => {
      //       const [apps, packages] = await Promise.all([
      //         getAppRegistry(),
      //         getPackageRegistry(),
      //       ]);

      //       return {apps, packages};
      //     },
      //   },
      // ],
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            ariaHidden: true,
            tabIndex: -1,
            className: 'autolink-heading',
          },
          content: [
            s(
              'svg.anchor.before',
              {
                xmlns: 'http://www.w3.org/2000/svg',
                width: 16,
                height: 16,
                fill: 'currentColor',
                viewBox: '0 0 24 24',
              },
              s('path', {
                d: 'M9.199 13.599a5.99 5.99 0 0 0 3.949 2.345 5.987 5.987 0 0 0 5.105-1.702l2.995-2.994a5.992 5.992 0 0 0 1.695-4.285 5.976 5.976 0 0 0-1.831-4.211 5.99 5.99 0 0 0-6.431-1.242 6.003 6.003 0 0 0-1.905 1.24l-1.731 1.721a.999.999 0 1 0 1.41 1.418l1.709-1.699a3.985 3.985 0 0 1 2.761-1.123 3.975 3.975 0 0 1 2.799 1.122 3.997 3.997 0 0 1 .111 5.644l-3.005 3.006a3.982 3.982 0 0 1-3.395 1.126 3.987 3.987 0 0 1-2.632-1.563A1 1 0 0 0 9.201 13.6zm5.602-3.198a5.99 5.99 0 0 0-3.949-2.345 5.987 5.987 0 0 0-5.105 1.702l-2.995 2.994a5.992 5.992 0 0 0-1.695 4.285 5.976 5.976 0 0 0 1.831 4.211 5.99 5.99 0 0 0 6.431 1.242 6.003 6.003 0 0 0 1.905-1.24l1.723-1.723a.999.999 0 1 0-1.414-1.414L9.836 19.81a3.985 3.985 0 0 1-2.761 1.123 3.975 3.975 0 0 1-2.799-1.122 3.997 3.997 0 0 1-.111-5.644l3.005-3.006a3.982 3.982 0 0 1 3.395-1.126 3.987 3.987 0 0 1 2.632 1.563 1 1 0 0 0 1.602-1.198z',
              })
            ),
          ],
        },
      ],
      [rehypePrismPlus, {ignoreMissing: true}],
      [rehypePrismDiff, {remove: true}],
      // rehypePresetMinify,
    ],
  };

  return (
    <DocPage frontMatter={doc.frontMatter}>
      <MDXRemote
        source={doc.source}
        options={{
          mdxOptions,
          parseFrontmatter: true,
        }}
        components={mdxComponents({PlatformContent})}
      />
    </DocPage>
  );
}

type MetadataProps = {
  params: {
    path?: string[];
  };
};

export async function generateMetadata({params}: MetadataProps): Promise<Metadata> {
  const domain = 'https://docs.sentry.io';
  let title = 'Home';
  let description = '';
  const images = [{url: `${domain}/meta.png`, width: 1200, height: 630}];

  const rootNode = await getDocsRootNode();
  if (rootNode && params.path) {
    const pageNode = nodeForPath(rootNode, params.path);
    if (pageNode) {
      title = pageNode.frontmatter.title;
      description = pageNode.frontmatter.description;
    }
  }

  let canonical = domain;
  if (params.path) {
    canonical = `${domain}/${params.path.join('/')}/`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images,
    },
    twitter: {
      title,
      description,
      images,
    },
    alternates: {
      canonical,
    },
  };
}
