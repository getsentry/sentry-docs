import React from "react";

import CodeContext, { useCodeContextState } from "./codeContext";
import SEO from "./seo";
import Layout from "./layout";
import SmartLink from "./smartLink";
import TableOfContents from "./tableOfContents";
import * as Sentry from "@sentry/gatsby";

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

export default ({
  data: { file },
  pageContext: { title },
  sidebar,
  children,
}) => {
  const tx = Sentry.getCurrentHub()
    .getScope()
    .getTransaction();
  if (tx) {
    tx.setStatus("ok");
  }

  const child = file && (file.childMarkdownRemark || file.childMdx);
  const hasToc = child && !!child.tableOfContents.items;
  return (
    <Layout title={title} file={file} sidebar={sidebar}>
      <SEO title={title} file={file} />

      <div className="row">
        <div
          className={hasToc ? "col-sm-8 col-md-12 col-lg-8 col-xl-9" : "col-12"}
        >
          <h1 className="mb-3">{title}</h1>
          <div id="main">
            <CodeContext.Provider value={useCodeContextState()}>
              {children}
            </CodeContext.Provider>

            {file && (
              <GitHubCTA
                sourceInstanceName={file.sourceInstanceName}
                relativePath={file.relativePath}
              />
            )}
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
    </Layout>
  );
};
