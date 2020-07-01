import React from "react";
import { graphql } from "gatsby";

import Content from "./content";
import SEO from "./seo";
import Header from "./header";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import SmartLink from "./smartLink";
import TableOfContents from "./tableOfContents";

import "~src/css/screen.scss";

const GitHubCTA = ({ sourceInstanceName, relativePath }) => (
  <div className="github-cta">
    <small>
      You can{" "}
      <SmartLink
        to={`https://github.com/getsentry/develop/edit/master/src/${sourceInstanceName}/${relativePath}`}
      >
        edit this page
      </SmartLink>{" "}
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
                  hasToc ? "col-sm-8 col-md-12 col-lg-8 col-xl-9" : "col-12"
                }
              >
                <h1 className="mb-3">{title}</h1>
                <div id="main">
                  <Content file={file} />

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
      <div style={{ display: "none" }}>Rendered with Gatsby</div>
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
