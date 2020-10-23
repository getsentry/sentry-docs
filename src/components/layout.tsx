import React from "react";

import Breadcrumbs from "./breadcrumbs";
import Header from "./header";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

import "~src/css/screen.scss";

type Props = {
  children: JSX.Element | JSX.Element[];
  sidebar?: JSX.Element;
  pageContext?: {
    platform?: {
      name?: string;
      [key: string]: any;
    };
  };
};

export default ({
  children,
  sidebar,
  pageContext = {},
}: Props): JSX.Element => {
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
              {sidebar ? sidebar : <Sidebar />}
            </div>
          </div>
        </div>
      </div>

      <main role="main" className="px-0">
        <div className="flex-grow-1">
          <div className="d-none d-md-block navbar-right-half">
            <Navbar
              {...(pageContext.platform && {
                platforms: [pageContext.platform.name],
              })}
            />
          </div>

          <section className="pt-3 px-3 content-max prose">
            <div className="pb-3">
              <Breadcrumbs />
            </div>
            {children}
          </section>
        </div>
      </main>
    </div>
  );
};
