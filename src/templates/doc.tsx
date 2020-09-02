import React from "react";
import { graphql } from "gatsby";

import BasePage from "~src/components/basePage";
import Content from "~src/components/content";

export default props => {
  return (
    <BasePage {...props}>
      <Content file={props.data.file} />
    </BasePage>
  );
};

export const pageQuery = graphql`
  query DocQuery($id: String) {
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
