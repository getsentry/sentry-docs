import PropTypes from "prop-types";
import React from "react";
import { StaticQuery, graphql } from "gatsby";

import Content from "./content";

const includeQuery = graphql`
  query SdkIncludeQuery {
    allFile(filter: { absolutePath: { regex: "//src/includes//" } }) {
      nodes {
        relativePath
        name
        childMarkdownRemark {
          internal {
            type
          }
          html
        }
        childMdx {
          internal {
            type
          }
          body
        }
      }
    }
  }
`;

const Include = ({ path, ...args }) => {
  return (
    <StaticQuery
      query={includeQuery}
      render={({
        allFile: { nodes: files },
      }) => {
        const matches = files.filter(
          node => node.relativePath.indexOf(path) === 0
        ).pop();
        return (
            <Content file={matches} replacePlaceholder={args}></Content>
        );
      }}
    />
  );
};

Include.propTypes = {
  path: PropTypes.string.isRequired
};

Include.defaultProps = {};

export default Include;
