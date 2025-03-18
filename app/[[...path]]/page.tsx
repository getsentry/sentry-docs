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
  DocNode,
  getCurrentPlatformOrGuide,
  getDocsRootNode,
  getNextNode,
  getPreviousNode,
  nodeForPath,
} from 'sentry-docs/docTree';
import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';
import {
  getDevDocsFrontMatter,
  getDocsFrontMatter,
  getFileBySlug,
  getVersionsFromDoc,
} from 'sentry-docs/mdx';
import {mdxComponents} from 'sentry-docs/mdxComponents';
import {setServerContext} from 'sentry-docs/serverContext';
import {PaginationNavNode} from 'sentry-docs/types/paginationNavNode';
import {stripVersion} from 'sentry-docs/versioning';

export async function generateStaticParams() {
  const docs = await (isDeveloperDocs ? getDevDocsFrontMatter() : getDocsFrontMatter());
  const paths: {path: string[] | undefined}[] = docs.map(doc => {
    const path = doc.slug.split('/');
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
  ({children, frontMatter, nextPage, previousPage}) => (
    <DocPage frontMatter={frontMatter} nextPage={nextPage} previousPage={previousPage}>
      {children}
    </DocPage>
  )
);

function MDXLayoutRenderer({mdxSource, ...rest}) {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);
  return <MDXLayout components={mdxComponentsWithWrapper} {...rest} />;
}

export default async function Page(props: {params: Promise<{path?: string[]}>}) {
  const params = await props.params;
  // get frontmatter of all docs in tree
  const rootNode = await getDocsRootNode();

  setServerContext({
    rootNode,
    path: params.path ?? [],
  });

  if (!params.path && !isDeveloperDocs) {
    return <Home />;
  }

  const pageNode = nodeForPath(rootNode, params.path ?? '');

  if (!pageNode) {
    // eslint-disable-next-line no-console
    console.warn('no page node', params.path);
    return notFound();
  }

  // gather previous and next page that will be displayed in the bottom pagination
  const getPaginationDetails = (
    getNode: (node: DocNode) => DocNode | undefined | 'root',
    page: PaginationNavNode | undefined
  ) => {
    if (page && 'path' in page && 'title' in page) {
      return page;
    }

    const node = getNode(pageNode);

    if (node === 'root') {
      return {path: '', title: 'Welcome to Sentry'};
    }

    return node ? {path: node.path, title: node.frontmatter.title} : undefined;
  };

  const previousPage = getPaginationDetails(
    getPreviousNode,
    pageNode?.frontmatter?.previousPage
  );
  const nextPage = getPaginationDetails(getNextNode, pageNode?.frontmatter?.nextPage);

  if (isDeveloperDocs) {
    // get the MDX for the current doc and render it
    let doc: Awaited<ReturnType<typeof getFileBySlug>> | null = null;
    try {
      doc = await getFileBySlug(`develop-docs/${params.path?.join('/') ?? ''}`);
    } catch (e) {
      if (e.code === 'ENOENT') {
        // eslint-disable-next-line no-console
        console.error('ENOENT', params.path);
        return notFound();
      }
      throw e;
    }
    const {mdxSource, frontMatter} = doc;
    // pass frontmatter tree into sidebar, rendered page + fm into middle, headers into toc
    return (
      <MDXLayoutRenderer
        mdxSource={mdxSource}
        frontMatter={frontMatter}
        nextPage={nextPage}
        previousPage={previousPage}
      />
    );
  }

  if (params.path?.[0] === 'api' && params.path.length > 1) {
    const categories = await apiCategories();
    const category = categories.find(c => c.slug === params?.path?.[1]);
    if (category) {
      if (params.path.length === 2) {
        return <ApiCategoryPage category={category} />;
      }
      const api = category.apis.find(a => a.slug === params.path?.[2]);
      if (api) {
        return <ApiPage api={api} />;
      }
    }
  }

  // get the MDX for the current doc and render it
  let doc: Awaited<ReturnType<typeof getFileBySlug>> | null = null;
  try {
    doc = await getFileBySlug(`docs/${pageNode.path}`);
  } catch (e) {
    if (e.code === 'ENOENT') {
      // eslint-disable-next-line no-console
      console.error('ENOENT', pageNode.path);
      return notFound();
    }
    throw e;
  }
  const {mdxSource, frontMatter} = doc;

  // collect versioned files
  const allFm = await getDocsFrontMatter();
  const versions = getVersionsFromDoc(allFm, pageNode.path);

  // pass frontmatter tree into sidebar, rendered page + fm into middle, headers into toc.
  return (
    <MDXLayoutRenderer
      mdxSource={mdxSource}
      frontMatter={{...frontMatter, versions}}
      nextPage={nextPage}
      previousPage={previousPage}
    />
  );
}

type MetadataProps = {
  params: Promise<{
    path?: string[];
  }>;
};

// Helper function to clean up canonical tags missing leading or trailing slash
function formatCanonicalTag(tag: string) {
  if (tag.charAt(0) !== '/') {
    tag = '/' + tag;
  }
  if (tag.charAt(tag.length - 1) !== '/') {
    tag = tag + '/';
  }
  return tag;
}

export async function generateMetadata(props: MetadataProps): Promise<Metadata> {
  const params = await props.params;
  const domain = isDeveloperDocs
    ? 'https://develop.sentry.dev'
    : 'https://docs.sentry.io';
  // enable og iamge preview on preview deployments
  const previewDomain = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : domain;
  let title =
    'Sentry Docs | Application Performance Monitoring &amp; Error Tracking Software';
  let customCanonicalTag: string = '';
  let description =
    'Self-hosted and cloud-based application performance monitoring &amp; error tracking that helps software teams see clearer, solve quicker, &amp; learn continuously.';
  // show og image on the home page only
  const images =
    ((await props.params).path ?? []).length === 0
      ? [{url: `${previewDomain ?? domain}/og.png`, width: 1200, height: 630}]
      : [];

  let noindex: undefined | boolean = undefined;

  const rootNode = await getDocsRootNode();

  if (params.path) {
    const pageNode = nodeForPath(
      rootNode,
      stripVersion(params.path.join('/')).split('/')
    );
    if (pageNode) {
      const guideOrPlatform = getCurrentPlatformOrGuide(rootNode, params.path);

      title =
        pageNode.frontmatter.title +
        (guideOrPlatform ? ` | Sentry for ${guideOrPlatform.title}` : '');
      description = pageNode.frontmatter.description ?? '';

      if (pageNode.frontmatter.customCanonicalTag) {
        customCanonicalTag = formatCanonicalTag(pageNode.frontmatter.customCanonicalTag);
      }

      noindex = pageNode.frontmatter.noindex;
    }
  }

  const canonical = customCanonicalTag
    ? domain + customCanonicalTag
    : params.path
      ? `${domain}/${params.path.join('/')}/`
      : domain;

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
    robots: noindex ? 'noindex' : undefined,
  };
}
