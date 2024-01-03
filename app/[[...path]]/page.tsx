import { useMemo } from "react";
import { getAllFilesFrontMatter, getFileBySlug } from "sentry-docs/mdx";
import { getMDXComponent } from 'mdx-bundler/client';
import Link from "next/link";
import { Header } from 'sentry-docs/components/header';
import { Navbar } from 'sentry-docs/components/navbar';
import { ServerSidebar } from 'sentry-docs/components/serverSidebar';
import { GitHubCTA } from "sentry-docs/components/githubCta";
import { notFound } from "next/navigation";
import { setServerContext } from "sentry-docs/serverContext";
import { frontmatterToTree, nodeForPath } from "sentry-docs/docTree";
import { Breadcrumbs } from "sentry-docs/components/breadcrumbs";
import { mdxComponents } from "sentry-docs/mdxComponents";
import { Include } from "sentry-docs/components/include";
import { Home } from "sentry-docs/components/home";
import { PlatformContent } from "sentry-docs/components/platformContent";
import { GuideGrid } from "sentry-docs/components/guideGrid";
import { Metadata, ResolvingMetadata } from "next";

export async function generateStaticParams() {
  const docs = await getAllFilesFrontMatter();
  const paths = docs.map((doc) => {
    let path = doc.slug.split('/');
    if (path[path.length - 1] === 'index') {
      path = path.slice(0, path.length - 1);
    }
    return { path };
  });
  paths.push({ path: undefined }); // the home page
  return paths;
}

// Only render paths returned by generateStaticParams
export const dynamicParams = false;
export const dynamic = 'force-static';

const mdxComponentsWithWrapper = mdxComponents({Include, PlatformContent}, ({ children, frontMatter, toc }) => (
  <Layout
    children={children}
    frontMatter={frontMatter}
    toc={toc}
    />
))

const Layout = ({children, frontMatter, toc}) => {
  const hasToc = !frontMatter.notoc;

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
        <div className="d-sm-none d-block" id="navbar-menu"></div>
      </div>
      <main role="main" className="px-0">
        <div className="flex-grow-1">
          <div className="d-block navbar-right-half">
            <Navbar />
          </div>

          <section className="pt-3 px-3 content-max prose">
            <div className="pb-3"><Breadcrumbs /></div>
            <div className="row">
              <div
                className={
                  hasToc ? "col-sm-8 col-md-12 col-lg-8 col-xl-9" : 'col-12'
                }
              >
                <h1>{frontMatter.title}</h1>
                {children}
                <GitHubCTA />
              </div>
              {hasToc && (
                <div className="col-sm-4 col-md-12 col-lg-4 col-xl-3">
                  <div className="page-nav">
                    <div className="doc-toc">
                      {toc.length > 0 && <div className="doc-toc-title">
                        <h6>On this page</h6>
                      </div>}
                      <ul className="section-nav">
                        {toc.map((entry) => (
                          <li className="toc-entry" key={entry.url}>
                            <Link href={entry.url}>{entry.value}</Link>
                          </li>
                        ))}
                      </ul>
                      <GuideGrid className="section-nav" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const MDXLayoutRenderer = ({ mdxSource, ...rest }) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])
  return <MDXLayout components={mdxComponentsWithWrapper} {...rest} />;
}

export default async function Page({ params }) {
  if (!params.path) {
    return <Home />;
  }

  // get frontmatter of all docs in tree
  const docs = await getAllFilesFrontMatter();
  const rootNode = frontmatterToTree(docs);
  if (!rootNode) {
    console.warn('no root node');
    return notFound();
  }

  const pageNode = nodeForPath(rootNode, params.path);
  if (!pageNode) {
    console.warn('no page node', params.path)
    return notFound();
  }
  
  // get the MDX for the current doc and render it
  let doc: any = null;
  try {
    doc = await getFileBySlug(`docs/${pageNode.path}`);
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error('ENOENT', pageNode.path)
      return notFound();
    } else {
      throw(e);
    }
  }
  const { mdxSource, toc, frontMatter } = doc;
  
  setServerContext({
    rootNode: rootNode,
    path: params.path,
    toc: toc,
    frontmatter: frontMatter,
  })
  
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
    path: string[]
  }
}

export async function generateMetadata(
  { params }: MetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> { 
  let title = 'Home';

  const docs = await getAllFilesFrontMatter();
  const rootNode = frontmatterToTree(docs);
  if (rootNode && params.path) {
    const pageNode = nodeForPath(rootNode, params.path);
    if (pageNode) {
      title = pageNode.frontmatter.title;
    }
  }
  // get the MDX for the current doc and render it
  return {
    title
  }
}
