import React from "react";
import { graphql } from "gatsby";

import BasePage from "~src/components/basePage";
import Content from "~src/components/content";
import PlatformSidebar from "~src/components/platformSidebar";

type Props = {
  data: {
    file: any;
  };
  pageContext: {
    title: string;
    platform: {
      name: string;
      title: string;
    };
    guide?: {
      name: string;
      title: string;
    };
  };
};

export default (props: Props) => {
  const { pageContext } = props;
  return (
    <BasePage
      {...props}
      seoTitle={`${props.pageContext.title} for ${
        (props.pageContext.guide || props.pageContext.platform).title
      }`}
      sidebar={
        <PlatformSidebar
          platform={pageContext.platform}
          guide={pageContext.guide}
        />
      }
    >
      <Content file={props.data.file} />
    </BasePage>
  );
};

export const pageQuery = graphql`
  query PlatformPageQuery($id: String) {
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
        }
      }
    }
  }
`;
