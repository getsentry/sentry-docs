import {useMemo} from 'react';
import {getMDXComponent} from 'mdx-bundler/client';
import {Metadata} from 'next';
import {notFound} from 'next/navigation';

import {apiCategories} from 'sentry-docs/build/resolveOpenAPI';
import {ApiCategoryPage} from 'sentry-docs/components/apiCategoryPage';
import {ApiPage} from 'sentry-docs/components/apiPage';
import {DocPage} from 'sentry-docs/components/docPage';
import {Home} from 'sentry-docs/components/home';
import {Include} from 'sentry-docs/components/include';
import {PlatformContent} from 'sentry-docs/components/platformContent';
import {
  getCurrentPlatformOrGuide,
  getDocsRootNode,
  nodeForPath,
} from 'sentry-docs/docTree';
import {getDocsFrontMatter, getFileBySlug} from 'sentry-docs/mdx';
import {mdxComponents} from 'sentry-docs/mdxComponents';
import {setServerContext} from 'sentry-docs/serverContext';
import {capitilize} from 'sentry-docs/utils';

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

const mdxComponentsWithWrapper = mdxComponents(
  {Include, PlatformContent},
  ({children, frontMatter}) => <DocPage frontMatter={frontMatter}>{children}</DocPage>
);

function MDXLayoutRenderer({mdxSource, ...rest}) {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);
  return <MDXLayout components={mdxComponentsWithWrapper} {...rest} />;
}

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
  let doc: any = null;
  try {
    doc = await getFileBySlug(`docs/${pageNode.path}`);
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error('ENOENT', pageNode.path);
      return notFound();
    }
    throw e;
  }
  const {mdxSource, frontMatter} = doc;

  // pass frontmatter tree into sidebar, rendered page + fm into middle, headers into toc
  return (
    <MDXLayoutRenderer docs={docs} mdxSource={mdxSource} frontMatter={frontMatter} />
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
      const guideOrPlatform = getCurrentPlatformOrGuide(rootNode, params.path);
      title =
        pageNode.frontmatter.title +
        (guideOrPlatform ? ` | Sentry for ${capitilize(guideOrPlatform.name)}` : '');
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
