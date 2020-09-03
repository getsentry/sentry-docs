import React from "react";
import { graphql } from "gatsby";

import ApiSidebar from "~src/components/apiSidebar";
import BasePage from "~src/components/basePage";
import Content from "~src/components/content";

export default props => {
  return (
    <BasePage sidebar={<ApiSidebar />} {...props}>
      <Content file={props.data.file} />
    </BasePage>
  );
};

export const pageQuery = graphql`
  query ApiDocQuery($id: String) {
    file(id: { eq: $id }) {
      id
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
          noindex
          notoc
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
          noindex
          notoc
        }
      }
    }
  }
`;
