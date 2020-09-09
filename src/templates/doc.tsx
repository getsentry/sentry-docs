import React from "react";
import { graphql } from "gatsby";

import BasePage from "~src/components/basePage";
import Content from "~src/components/content";
import DevelopmentApiSidebar from "~src/components/developmentApiSidebar";

export default props => {
  return (
    <BasePage
      sidebar={
        props.path.startsWith("/development-api") ? (
          <DevelopmentApiSidebar />
        ) : null
      }
      {...props}
    >
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
