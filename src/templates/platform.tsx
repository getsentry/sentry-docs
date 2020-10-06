import React from "react";
import { graphql } from "gatsby";

import BasePage from "../components/basePage";
import Content from "../components/content";
import PlatformSdkDetail from "../components/platformSdkDetail";
import PlatformSidebar from "../components/platformSidebar";

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
  // Ruby
  // Rails
  // X for Ruby
  // X for Rails
  const seoTitle =
    props.pageContext.title ===
    (props.pageContext.guide || props.pageContext.platform).title
      ? props.pageContext.title
      : `${props.pageContext.title} for ${
          (props.pageContext.guide || props.pageContext.platform).title
        }`;
  return (
    <BasePage
      {...props}
      seoTitle={seoTitle}
      prependToc={<PlatformSdkDetail />}
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
