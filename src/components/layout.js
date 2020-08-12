import React from "react";
import { StaticQuery, graphql } from "gatsby";

import Header from "./header";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

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
