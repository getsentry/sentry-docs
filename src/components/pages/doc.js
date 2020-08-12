import React from "react";
import { graphql } from "gatsby";

import BasePage from "../basePage";
import Content from "../content";

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
          robots
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
          robots
        }
      }
    }
  }
`;
