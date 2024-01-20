import {useMemo} from 'react';
import {getMDXComponent} from 'mdx-bundler/client';
import {Metadata} from 'next';
import {notFound} from 'next/navigation';

import {Breadcrumbs} from 'sentry-docs/components/breadcrumbs';
import {CodeContextProvider} from 'sentry-docs/components/codeContext';
import {GitHubCTA} from 'sentry-docs/components/githubCta';
import {Header} from 'sentry-docs/components/header';
import {Home} from 'sentry-docs/components/home';
import {Include} from 'sentry-docs/components/include';
import {Navbar} from 'sentry-docs/components/navbar';
import {PlatformContent} from 'sentry-docs/components/platformContent';
import {PlatformSdkDetail} from 'sentry-docs/components/platformSdkDetail';
import {ServerSidebar} from 'sentry-docs/components/serverSidebar';
import {TableOfContents} from 'sentry-docs/components/tableOfContents';
import {
  frontmatterToTree,
  getCurrentPlatformOrGuide,
  nodeForPath,
} from 'sentry-docs/docTree';
import {allDocsFrontMatter, getFileBySlug} from 'sentry-docs/mdx';
import {mdxComponents} from 'sentry-docs/mdxComponents';
import {serverContext, setServerContext} from 'sentry-docs/serverContext';

export function generateStaticParams() {
  const docs = allDocsFrontMatter;
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
  ({children, frontMatter, toc}) => (
    <Layout frontMatter={frontMatter} toc={toc}>
      {children}
    </Layout>
  )
);

function Layout({children, frontMatter, toc}) {
  const {rootNode, path} = serverContext();
  const platformOrGuide = rootNode && getCurrentPlatformOrGuide(rootNode, path);
  const hasToc = !frontMatter.notoc || !!platformOrGuide;

  return (
    <div className="document-wrapper">
      <div className="sidebar">
        <Header />

        <div
          className="d-md-flex flex-column align-items-stretch collapse navbar-collapse"
          id="sidebar"
        >
          <div className="toc">
            <div className="text-white p-3">
              <ServerSidebar />
            </div>
          </div>
        </div>
        <div className="d-sm-none d-block" id="navbar-menu" />
      </div>
      <main role="main" className="px-0">
        <div className="flex-grow-1">
          <div className="d-block navbar-right-half">
            <Navbar />
          </div>

          <section className="pt-3 px-3 content-max prose">
            <div className="pb-3">
              <Breadcrumbs />
            </div>
            <div className="row">
              <div className={hasToc ? 'col-sm-8 col-md-12 col-lg-8 col-xl-9' : 'col-12'}>
                <h1 className="mb-3">{frontMatter.title}</h1>
                <div id="main">
                  <CodeContextProvider>{children}</CodeContextProvider>
                </div>
                <GitHubCTA />
              </div>
              {hasToc && (
                <div className="col-sm-4 col-md-12 col-lg-4 col-xl-3">
                  <div className="page-nav">
                    <PlatformSdkDetail />
                    <TableOfContents toc={toc} />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function MDXLayoutRenderer({mdxSource, ...rest}) {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);
  return <MDXLayout components={mdxComponentsWithWrapper} {...rest} />;
}

export default async function Page({params}) {
  if (!params.path) {
    return <Home />;
  }

  // get frontmatter of all docs in tree
  const docs = allDocsFrontMatter;
  const rootNode = frontmatterToTree(docs);
  if (!rootNode) {
    console.warn('no root node');
    return notFound();
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
  const {mdxSource, toc, frontMatter} = doc;

  setServerContext({
    rootNode,
    path: params.path,
    toc,
    frontmatter: frontMatter,
  });

  // pass frontmatter tree into sidebar, rendered page + fm into middle, headers into toc
  return (
    <MDXLayoutRenderer
      docs={docs}
      toc={toc}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
    />
  );
}

type MetadataProps = {
  params: {
    path: string[];
  };
};

export function generateMetadata({params}: MetadataProps): Metadata {
  let title = 'Home';

  const docs = allDocsFrontMatter;
  const rootNode = frontmatterToTree(docs);
  if (rootNode && params.path) {
    const pageNode = nodeForPath(rootNode, params.path);
    if (pageNode) {
      title = pageNode.frontmatter.title;
    }
  }
  // get the MDX for the current doc and render it
  return {
    title,
  };
}
