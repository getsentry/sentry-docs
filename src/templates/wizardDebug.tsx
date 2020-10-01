import React from "react";
import { graphql } from "gatsby";

import Content from "~src/components/content";

export default ({ data: { file } }) => {
  const { frontmatter } = file.childMarkdownRemark;
  return (
    <div style={{ margin: "2rem" }}>
      <div
        style={{
          border: "1px solid #ccc",
          marginBottom: "2rem",
          padding: "1rem",
          background: "#f0f0f0",
        }}
      >
        <h2>Wizard Preview</h2>
        <dl style={{ marginBottom: 0 }}>
          <dt>Name</dt>
          <dd>{frontmatter.name}</dd>
          <dt>Link</dt>
          <dd>
            <a href={frontmatter.doc_link}>{frontmatter.doc_link}</a>
          </dd>
          <dt>Type</dt>
          <dd>{frontmatter.type}</dd>
          <dt>Support Level</dt>
          <dd>{frontmatter.support_level}</dd>
        </dl>
      </div>
      <Content file={file} />
    </div>
  );
};

export const pageQuery = graphql`
  query WizardDebugQuery($id: String) {
    file(id: { eq: $id }) {
      id
      relativePath
      sourceInstanceName
      childMarkdownRemark {
        html
        internal {
          type
        }
        frontmatter {
          name
          doc_link
          support_level
          type
        }
      }
    }
  }
`;
