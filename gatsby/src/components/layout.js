import React from 'react';
import { graphql } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import Alert from './alert';
import SEO from './seo';
import Header from './header';
import Sidebar from './sidebar';
import Navbar from './navbar';
import SmartLink from './smartLink';
import CodeBlock from './codeBlock';
import CodeTabs, { CodeContext, useCodeContextState } from './codeTabs';
import Break from './break';

import 'prismjs/themes/prism-tomorrow.css';
import '~src/css/screen.scss';

const mdxComponents = {
  Alert,
  a: SmartLink,
  Link: SmartLink,
  CodeBlock,
  CodeTabs,
  Break
};

const TableOfContents = ({ toc: { items } }) => {
  if (!items) return null;

  const recurseyMcRecurseFace = items =>
    items.map(i => {
      if (!i.title) return recurseyMcRecurseFace(i.items);
      return (
        <li className="toc-entry" key={i.url}>
          <a href={i.url}>{i.title}</a>
          {i.items && <ul>{recurseyMcRecurseFace(i.items)}</ul>}
        </li>
      );
    });
  return <ul className="section-nav">{recurseyMcRecurseFace(items)}</ul>;
};

function fetchCodeKeywords() {
  return new Promise(resolve => {
    function transformResults(projects) {
      if (projects.length === 0) {
        projects.push({
          publicKey: 'e24732883e6fcdad45fd27341e61f8899227bb39',
          dsnPublic:
            'https://e24732883e6fcdad45fd27341e61f8899227bb39@o42.ingest.sentry.io/42',
          id: 42,
          organizationName: 'Example Org',
          organizationId: 43,
          organizationSlug: 'example-org',
          projectSlug: 'example-project'
        });
      }
      resolve({
        PROJECT: projects.map(project => {
          return {
            DSN: project.dsnPublic,
            ID: project.id,
            SLUG: project.projectSlug,
            ORG_SLUG: project.organizationSlug,
            title: `${project.organizationName} / ${project.projectSlug}`
          };
        })
      });
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://sentry.io/docs/api/user/');
    xhr.withCredentials = true;
    xhr.responseType = 'json';
    xhr.onerror = () => {
      transformResults([]);
    };
    xhr.onload = () => {
      const { projects } = xhr.response;
      transformResults(projects);
    };
    xhr.send(null);
  });
}

const GitHubCTA = ({ sourceInstanceName, relativePath }) => (
  <div className="github-cta">
    <small>
      You can{' '}
      <SmartLink
        to={`https://github.com/getsentry/develop/edit/master/src/${sourceInstanceName}/${relativePath}`}
      >
        edit this page
      </SmartLink>{' '}
      on GitHub.
    </small>
  </div>
);

const Layout = ({
  data: {
    file,
    site: { siteMetadata }
  },
  pageContext: { title }
}) => {
  const child = file.childMarkdownRemark || file.childMdx;
  const hasToc = !!child.tableOfContents.items;
  return (
    <div className="document-wrapper">
      <SEO title={title} />
      <div className="sidebar">
        <Header
          siteTitle={siteMetadata.title}
          homeUrl={siteMetadata.homeUrl}
          sitePath={siteMetadata.sitePath}
        />

        <div
          className="d-md-flex flex-column align-items-stretch collapse navbar-collapse"
          id="sidebar"
        >
          <div className="toc">
            <div className="text-white p-3">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>

      <main role="main" className="px-0">
        <div className="flex-grow-1">
          <div className="d-none d-md-block">
            <Navbar homeUrl={siteMetadata.homeUrl} />
          </div>

          <section className="pt-3 px-3 content-max prose">
            <div className="row">
              <div
                className={
                  hasToc ? 'col-sm-8 col-md-12 col-lg-8 col-xl-9' : 'col-12'
                }
              >
                <h1 className="mb-3">{title}</h1>
                <div id="main">
                  <CodeContext.Provider
                    value={useCodeContextState(fetchCodeKeywords)}
                  >
                    {child.internal.type === 'Mdx' ? (
                      <MDXProvider components={mdxComponents}>
                        <MDXRenderer>{child.body}</MDXRenderer>
                      </MDXProvider>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: child.html }} />
                    )}
                  </CodeContext.Provider>

                  <GitHubCTA
                    sourceInstanceName={file.sourceInstanceName}
                    relativePath={file.relativePath}
                  />
                </div>
              </div>
              {hasToc && (
                <div className="col-sm-4 col-md-12 col-lg-4 col-xl-3">
                  <div className="doc-toc">
                    <div className="doc-toc-title">
                      <h6>On this page</h6>
                    </div>
                    <TableOfContents toc={child.tableOfContents} />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <div style={{ display: 'none' }}>Rendered with Gatsby</div>
    </div>
  );
};

export default Layout;

export const pageQuery = graphql`
  query PageQuery($id: String) {
    site {
      siteMetadata {
        title
        homeUrl
        sitePath
      }
    }
    file(id: { eq: $id }) {
      relativePath
      sourceInstanceName
      childMarkdownRemark {
        html
        tableOfContents
        internal {
          type
        }
        frontmatter {
          title
        }
      }
      childMdx {
        body
        tableOfContents
        internal {
          type
        }
        frontmatter {
          title
        }
      }
    }
  }
`;
