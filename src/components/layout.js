import React from "react";
import { StaticQuery, graphql } from "gatsby";

import Header from "./header";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import SmartLink from "./smartLink";

import "~src/css/screen.scss";

const query = graphql`
  query Layoutquery {
    site {
      siteMetadata {
        title
        homeUrl
        sitePath
      }
    }
  }
`;

const GitHubCTA = ({ sourceInstanceName, relativePath }) => (
  <div className="github-cta">
    <small>
      You can{" "}
      <SmartLink
        to={`https://github.com/getsentry/sentry-docs/edit/master/src/${sourceInstanceName}/${relativePath}`}
      >
        edit this page
      </SmartLink>{" "}
      on GitHub.
    </small>
  </div>
);

export default ({ children }) => {
  return (
    <StaticQuery
      query={query}
      render={({ site: { siteMetadata } }) => {
        return (
          <div className="document-wrapper">
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
                  {children}
                </section>
              </div>
            </main>
          </div>
        );
      }}
    />
  );
};
