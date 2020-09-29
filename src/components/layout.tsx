import React from "react";

import Breadcrumbs from "./breadcrumbs";
import Header from "./header";
import Sidebar from "./sidebar";

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
  const hasSidebar = !!sidebar;

  return (
    <div className={`document-wrapper ${hasSidebar ? "with-sidebar" : ""}`}>
      <Header
        {...(pageContext.platform && {
          platforms: [pageContext.platform.name],
        })}
      />
      <main role="main">
        <section className="pt-3 px-3 content-max prose">
          <div className="pb-3">
            <Breadcrumbs />
          </div>
          {children}
        </section>
      </main>

      <div
        className="sidebar d-md-flex flex-column align-items-stretch collapse navbar-collapse"
        id="sidebar"
      >
        <div className="toc">
          <div className="text-white p-3">
            {sidebar ? sidebar : <Sidebar />}
          </div>
        </div>
      </div>
    </div>
  );
};
