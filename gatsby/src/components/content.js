import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";

import "prismjs/themes/prism-tomorrow.css";

import Alert from "./alert";
import Break from "./break";
import SmartLink from "./smartLink";
import CodeBlock from "./codeBlock";
import CodeTabs, { CodeContext, useCodeContextState } from "./codeTabs";
import PlatformContent from "./platformContent";

const mdxComponents = {
  Alert,
  a: SmartLink,
  Link: SmartLink,
  CodeBlock,
  CodeTabs,
  Break,
  PlatformContent
};

function fetchCodeKeywords() {
  return new Promise(resolve => {
    function transformResults(projects) {
      if (projects.length === 0) {
        projects.push({
          publicKey: "e24732883e6fcdad45fd27341e61f8899227bb39",
          dsnPublic:
            "https://e24732883e6fcdad45fd27341e61f8899227bb39@o42.ingest.sentry.io/42",
          id: 42,
          organizationName: "Example Org",
          organizationId: 43,
          organizationSlug: "example-org",
          projectSlug: "example-project"
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
    xhr.open("GET", "https://sentry.io/docs/api/user/");
    xhr.withCredentials = true;
    xhr.responseType = "json";
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

export default ({ file }) => {
  const child = file.childMarkdownRemark || file.childMdx;
  if (!child) return null;
  return (
    <CodeContext.Provider value={useCodeContextState(fetchCodeKeywords)}>
      {child.internal.type === "Mdx" ? (
        <MDXProvider components={mdxComponents}>
          <MDXRenderer>{child.body}</MDXRenderer>
        </MDXProvider>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: child.html }} />
      )}
    </CodeContext.Provider>
  );
};
