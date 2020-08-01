import PropTypes from "prop-types";
import React from "react";
import { StaticQuery, graphql } from "gatsby";
import { Location } from "@reach/router";
import { parse } from "query-string";

import Content from "./content";
import SmartLink from "./smartLink";

const includeQuery = graphql`
  query IncludeQuery {
    allPlatformsYaml(sort: { fields: slug, order: ASC }) {
      nodes {
        name
        slug
      }
    }
    allFile(filter: { sourceInstanceName: { eq: "includes" } }) {
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

const PlatformContent = ({ includePath }) => {
  const [dropdown, setDropdown] = React.useState(false);

  return (
    <StaticQuery
      query={includeQuery}
      render={({
        allFile: { nodes: files },
        allPlatformsYaml: { nodes: platforms }
      }) => {
        return (
          <Location>
            {({ location, navigate }) => {
              let platformQueryString = parse(location.search).platform || null;

              const matches = files.filter(
                node => node.relativePath.indexOf(includePath) === 0
              );
              const defaultPlatform = platforms.find(p =>
                matches.find(m => m.name === p.slug)
              );

              let activePlatform = platforms.find(
                p => p.slug === (platformQueryString || defaultPlatform.slug)
              );
              let contentMatch = matches.find(
                m => m.name === activePlatform.slug
              );
              if (
                !contentMatch &&
                platformQueryString !== defaultPlatform.slug
              ) {
                activePlatform = defaultPlatform;
                contentMatch = matches.find(
                  m => m.name === activePlatform.slug
                );
              }

              return (
                <div className="platform-specific-content">
                  <div className="nav pb-1 flex">
                    <div className="dropdown mr-2 mb-1">
                      <button
                        className="btn btn-sm btn-secondary dropdown-toggle"
                        onClick={() => setDropdown(!dropdown)}
                      >
                        {activePlatform.name}
                      </button>

                      <div
                        className="nav dropdown-menu"
                        role="tablist"
                        style={{ display: dropdown ? "block" : "none" }}
                      >
                        {matches.map(node => {
                          const platform = platforms.find(
                            p => p.slug === node.name
                          );
                          return (
                            <a
                              className="dropdown-item"
                              role="tab"
                              onClick={() => {
                                setDropdown(false);
                                navigate(
                                  `${location.pathname}?platform=${platform.slug}`
                                );
                                // TODO: retain scroll
                                // window.scrollTo(window.scrollX, window.scrollY);
                              }}
                            >
                              {platform.name}
                            </a>
                          );
                        })}
                        <SmartLink className="dropdown-item" to="/platforms/">
                          <em>Platform not listed?</em>
                        </SmartLink>
                      </div>
                    </div>
                  </div>

                  <div className="tab-content">
                    <div className="tab-pane show active">
                      <Content key={activePlatform.slug} file={contentMatch} />
                    </div>
                  </div>
                </div>
              );
            }}
          </Location>
        );
      }}
    />
  );
};

PlatformContent.propTypes = {
  includePath: PropTypes.string.isRequired
};

PlatformContent.defaultProps = {};

export default PlatformContent;
