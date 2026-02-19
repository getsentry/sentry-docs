import {Fragment, useMemo} from 'react';
import * as Sentry from '@sentry/nextjs';
import {Metadata} from 'next';
import {notFound} from 'next/navigation';

import {apiCategories} from 'sentry-docs/build/resolveOpenAPI';
import {ApiCategoryPage} from 'sentry-docs/components/apiCategoryPage';
import {ApiPage} from 'sentry-docs/components/apiPage';
import {DocPage} from 'sentry-docs/components/docPage';
import {Home} from 'sentry-docs/components/home';
import {Include} from 'sentry-docs/components/include';
import {PageLoadMetrics} from 'sentry-docs/components/pageLoadMetrics';
import {PlatformContent} from 'sentry-docs/components/platformContent';
import {SpecChangelog} from 'sentry-docs/components/specChangelog';
import {SpecMeta} from 'sentry-docs/components/specMeta';
import {
  DocNode,
  getCurrentPlatformOrGuide,
  getDocsRootNode,
  getNextNode,
  getPreviousNode,
  nodeForPath,
} from 'sentry-docs/docTree';
import {getMDXComponent} from 'sentry-docs/getMDXComponent';
import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';
import {
  getDevDocsFrontMatter,
  getDocsFrontMatter,
  getFileBySlugWithCache,
  getVersionsFromDoc,
} from 'sentry-docs/mdx';
import {mdxComponents} from 'sentry-docs/mdxComponents';
import {PageType} from 'sentry-docs/metrics';
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

function mdxComponentsForFrontMatter(frontMatter: Record<string, unknown>) {
  const specOverrides: Record<string, unknown> = {};
  const changelog = Array.isArray(frontMatter.spec_changelog)
    ? (frontMatter.spec_changelog as Array<Record<string, unknown>>).map(entry => ({
        version: String(entry.version),
        date:
          entry.date instanceof Date
            ? entry.date.toISOString().split('T')[0]
            : String(entry.date),
        summary: String(entry.summary),
      }))
    : undefined;
  if (changelog) {
    specOverrides.SpecChangelog = function() {
  return <SpecChangelog changelog={changelog} />
};
  }
  if (frontMatter.spec_version) {
    const boundProps = {
      version: String(frontMatter.spec_version),
      status: frontMatter.spec_status as
        | 'proposal'
        | 'draft'
        | 'candidate'
        | 'stable'
        | 'deprecated',
    };
    specOverrides.SpecMeta = function() {
  return <SpecMeta {...boundProps} />
};
  }
  return mdxComponents(
    {Include, PlatformContent, ...specOverrides},
    ({children, frontMatter: fm, nextPage, previousPage}) => (
      <DocPage
        frontMatter={fm}
        nextPage={nextPage}
        previousPage={previousPage}
        fullWidth={fm.fullWidth}
      >
        {children}
      </DocPage>
    )
  );
}

function MDXLayoutRenderer({mdxSource, ...rest}) {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);
  const components = useMemo(
    () => mdxComponentsForFrontMatter(rest.frontMatter || {}),
    [rest.frontMatter]
  );
  return <MDXLayout components={components} {...rest} />;
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
    return (
      <Fragment>
        <PageLoadMetrics pageType="home" />
        <Home />
      </Fragment>
    );
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
    let doc: Awaited<ReturnType<typeof getFileBySlugWithCache>>;
    try {
      doc = await getFileBySlugWithCache(`develop-docs/${params.path?.join('/') ?? ''}`);
    } catch (e: unknown) {
      // Handle file not found and runtime MDX compilation errors gracefully.
      // This can happen when serverless function is invoked at runtime but docs files
      // aren't in the bundle, or MDX compilation is attempted at Vercel runtime.
      // Note: This error handling is duplicated for regular docs below - keep them in sync.
      const errorCode = e && typeof e === 'object' && 'code' in e ? e.code : null;
      const isExpectedError =
        errorCode === 'ENOENT' ||
        errorCode === 'MDX_RUNTIME_ERROR' ||
        (e instanceof Error && e.message.includes('Failed to find a valid source file'));
      if (isExpectedError) {
        // Log as warning for visibility without flooding errors
        // Users are served static pages from CDN - this is an infrastructure edge case
        Sentry.logger.warn('MDX file not found at runtime, returning 404', {
          path: params.path?.join('/'),
          errorCode,
          reason: 'serverless_bundle_exclusion',
        });
        return notFound();
      }
      throw e;
    }
    const {mdxSource, frontMatter} = doc;

    // pass frontmatter tree into sidebar, rendered page + fm into middle, headers into toc
    const pageType = (params.path?.[0] as PageType) || 'unknown';
    return (
      <Fragment>
        <PageLoadMetrics pageType={pageType} attributes={{is_developer_docs: true}} />
        <MDXLayoutRenderer
          mdxSource={mdxSource}
          frontMatter={frontMatter}
          nextPage={nextPage}
          previousPage={previousPage}
        />
      </Fragment>
    );
  }

  if (params.path?.[0] === 'api' && params.path.length > 1) {
    const categories = await apiCategories();
    const category = categories.find(c => c.slug === params?.path?.[1]);
    if (category) {
      if (params.path.length === 2) {
        // API category page
        return (
          <Fragment>
            <PageLoadMetrics pageType="api" attributes={{api_category: category.slug}} />
            <ApiCategoryPage category={category} />
          </Fragment>
        );
      }
      const api = category.apis.find(a => a.slug === params.path?.[2]);
      if (api) {
        // Specific API endpoint page
        return (
          <Fragment>
            <PageLoadMetrics
              pageType="api"
              attributes={{
                api_category: category.slug,
                api_endpoint: api.slug,
              }}
            />
            <ApiPage api={api} />
          </Fragment>
        );
      }
    }
  }

  // get the MDX for the current doc and render it
  let doc: Awaited<ReturnType<typeof getFileBySlugWithCache>>;
  try {
    doc = await getFileBySlugWithCache(`docs/${pageNode.path}`);
  } catch (e: unknown) {
    // Handle file not found and runtime MDX compilation errors gracefully.
    // This can happen when serverless function is invoked at runtime but docs files
    // aren't in the bundle, or MDX compilation is attempted at Vercel runtime.
    // Note: This error handling is duplicated for developer docs above - keep them in sync.
    const errorCode = e && typeof e === 'object' && 'code' in e ? e.code : null;
    const isExpectedError =
      errorCode === 'ENOENT' ||
      errorCode === 'MDX_RUNTIME_ERROR' ||
      (e instanceof Error && e.message.includes('Failed to find a valid source file'));
    if (isExpectedError) {
      // Log as warning for visibility without flooding errors
      // Users are served static pages from CDN - this is an infrastructure edge case
      Sentry.logger.warn('MDX file not found at runtime, returning 404', {
        path: pageNode.path,
        errorCode,
        reason: 'serverless_bundle_exclusion',
      });
      return notFound();
    }
    throw e;
  }
  const {mdxSource, frontMatter} = doc;

  // collect versioned files
  const allFm = await getDocsFrontMatter();
  const versions = getVersionsFromDoc(allFm, pageNode.path);

  // pass frontmatter tree into sidebar, rendered page + fm into middle, headers into toc.
  const pageType = (params.path?.[0] as PageType) || 'unknown';
  return (
    <Fragment>
      <PageLoadMetrics
        pageType={pageType}
        attributes={{
          has_platform_content: params.path?.[0] === 'platforms',
          is_versioned: pageNode.path.includes('__v'),
          has_versions: versions && versions.length > 0,
        }}
      />
      <MDXLayoutRenderer
        mdxSource={mdxSource}
        frontMatter={{...frontMatter, versions}}
        nextPage={nextPage}
        previousPage={previousPage}
      />
    </Fragment>
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

// Helper function to resolve OG image URLs
function resolveOgImageUrl(
  imageUrl: string | undefined,
  domain: string,
  pagePath: string[]
): string | null {
  if (!imageUrl) {
    return null;
  }

  // Remove hash fragments (e.g., #600x400 from remark-image-processing)
  const cleanUrl = imageUrl.split('#')[0];

  // External URLs - return as is
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }

  // Absolute paths (public folder)
  if (cleanUrl.startsWith('/')) {
    return `${domain}${cleanUrl}`;
  }

  // Relative paths - resolve based on page path
  if (cleanUrl.startsWith('./')) {
    const relativePath = cleanUrl.slice(2); // Remove './'
    const pageDir = pagePath.join('/');
    return `${domain}/${pageDir}/${relativePath}`;
  }

  // Default case: treat as relative to page
  const pageDir = pagePath.join('/');
  return `${domain}/${pageDir}/${cleanUrl}`;
}

export async function generateMetadata(props: MetadataProps): Promise<Metadata> {
  const params = await props.params;
  const domain = isDeveloperDocs
    ? 'https://develop.sentry.dev'
    : 'https://docs.sentry.io';
  // enable og image preview on preview deployments
  const previewDomain = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : domain;
  let title =
    'Sentry Docs | Application Performance Monitoring & Error Tracking Software';
  let customCanonicalTag: string = '';
  let description =
    'Self-hosted and cloud-based application performance monitoring & error tracking that helps software teams see clearer, solve quicker, and learn continuously.';

  let ogImageUrl: string | null = null;
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

      // Check for manual OG image override in frontmatter
      if (pageNode.frontmatter.og_image) {
        ogImageUrl = resolveOgImageUrl(
          pageNode.frontmatter.og_image,
          previewDomain ?? domain,
          params.path
        );
      }
    }
  }

  // Default fallback
  if (!ogImageUrl) {
    ogImageUrl = `${previewDomain ?? domain}/og.png`;
  }

  const images = [{url: ogImageUrl, width: 1200, height: 630}];

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
