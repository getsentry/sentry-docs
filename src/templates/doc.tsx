import React from "react";
import { graphql } from "gatsby";

import BasePage from "~src/components/basePage";
import Content from "~src/components/content";
import ApiSidebar from "~src/components/apiSidebar";
import InternalDocsSidebar from "~src/components/internalDocsSidebar";

export default (props: any) => {
  let sidebar = null;
  if (props.path.startsWith("/api/")) {
    sidebar = <ApiSidebar />;
  } else if (props.path.startsWith("/contributing/")) {
    sidebar = <InternalDocsSidebar />;
  }
  return (
    <BasePage sidebar={sidebar} {...props}>
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
        internal {
          type
        }
      }
      childMdx {
        body
        internal {
          type
        }
      }
    }
  }
`;
