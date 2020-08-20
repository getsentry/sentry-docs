import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import BasePage from "~src/components/basePage";
import Content from "~src/components/content";
import PlatformSidebar from "~src/components/platformSidebar";

const PlatformPage = props => {
  const { pageContext } = props;
  return (
    <BasePage
      {...props}
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

PlatformPage.propTypes = {
  data: PropTypes.shape({
    file: PropTypes.object,
  }),
  pageContext: PropTypes.shape({
    title: PropTypes.string.isRequired,
    platform: PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    guide: PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  }),
};

export default PlatformPage;

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
