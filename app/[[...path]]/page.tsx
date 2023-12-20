import { useMemo } from "react";
import { getAllFilesFrontMatter, getFileBySlug } from "sentry-docs/mdx";
import { getMDXComponent } from 'mdx-bundler/client';
import Link from "next/link";
import { PageGrid } from "sentry-docs/components/pageGrid";
import { Header } from 'sentry-docs/components/header';
import { Navbar } from 'sentry-docs/components/navbar';
import { ServerSidebar } from 'sentry-docs/components/serverSidebar';
import { Note } from "sentry-docs/components/note";
import { PlatformContent } from "sentry-docs/components/platformContent";
import { PlatformGrid } from "sentry-docs/components/platformGrid";
import { PlatformLink } from "sentry-docs/components/platformLink";
import { Alert } from "sentry-docs/components/alert";
import { GitHubCTA } from "sentry-docs/components/githubCta";
import { MDXComponents } from "mdx/types";
import { notFound } from "next/navigation";
import { setServerContext } from "sentry-docs/serverContext";
import { frontmatterToTree, nodeForPath } from "sentry-docs/docTree";
import { SignInNote } from "sentry-docs/components/signInNote";
import { Breadcrumbs } from "sentry-docs/components/breadcrumbs";
import { DefinitionList } from "sentry-docs/components/definitionList";
import { PlatformIdentifier } from "sentry-docs/components/platformIdentifier";
import { PlatformSection } from "sentry-docs/components/platformSection";
import { ConfigKey } from "sentry-docs/components/configKey";
import { SandboxLink } from "sentry-docs/components/sandboxLink";
import { Include } from "sentry-docs/components/include";
import { OrgAuthTokenNote } from "sentry-docs/components/orgAuthTokenNote";
import { SmartLink } from "sentry-docs/components/smartLink";
import { GuideGrid } from "sentry-docs/components/guideGrid";
import { LambdaLayerDetail } from "sentry-docs/components/lambdaLayerDetail";

export async function generateStaticParams() {
  const docs = await getAllFilesFrontMatter();
  return docs.map((doc) => ({ path: doc.slug.split('/') }));
}

const MDXComponents: MDXComponents = {
  Alert,
  ConfigKey,
  DefinitionList,
  Include,
  GuideGrid,
  LambdaLayerDetail,
  Link: SmartLink,
  Note,
  OrgAuthTokenNote,
  PageGrid,
  PlatformContent,
  PlatformGrid,
  PlatformIdentifier,
  PlatformLink,
  PlatformSection,
  SandboxLink,
  SignInNote,
  // a: Link, // TODO: fails type check
  wrapper: ({ children, frontMatter, docs, toc }) => (
    <Layout
      children={children}
      frontMatter={frontMatter}
      docs={docs}
      toc={toc}
      />
  )
}

const Layout = ({children, frontMatter, docs, toc}) => {
  return (
    <>
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
              <div className="col-sm-8 col-md-12 col-lg-8 col-xl-9">
                <h1>{frontMatter.title}</h1>
                {children}
                <GitHubCTA />
              </div>
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
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

const MDXLayoutRenderer = ({ mdxSource, ...rest }) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])
  return <MDXLayout components={MDXComponents} {...rest} />;
}

export default async function Page({ params }) {
  // get frontmatter of all docs in tree
  const docs = await getAllFilesFrontMatter();
  const rootNode = frontmatterToTree(docs);
  if (!rootNode) {
    return notFound();
  }

  const pageNode = nodeForPath(rootNode, params.path);
  if (!pageNode) {
    console.log('failed to find ', params.path);
    return notFound();
  }
  
  // get the MDX for the current doc and render it
  let doc: any = null;
  try {
    doc = await getFileBySlug(`docs/${pageNode.path}`);
  } catch (e) {
    if (e.code === 'ENOENT') {
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
