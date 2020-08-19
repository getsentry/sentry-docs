import PropTypes from "prop-types";
import React from "react";
import { StaticQuery, graphql } from "gatsby";
import { Location } from "@reach/router";
import { parse } from "query-string";

const query = graphql`
  query ConfigKeyQuery {
    allPlatformsYaml(sort: { fields: slug, order: ASC }) {
      nodes {
        name
        slug
        case_style
      }
    }
  }
`;

const normalizeSlug = slug => {
  switch (slug) {
    case "browser":
      return "javascript";
    case "browsernpm":
      return "javascript";
    default:
      return slug;
  }
};

const formatCase = (style, value) => {
  switch (style) {
    case "snake_case":
      return value.replace(/-/g, "_");
    case "camelCase":
      return value
        .split(/-/g)
        .map((val, idx) =>
          idx === 0 ? val : val.charAt(0).toUpperCase() + val.substr(1)
        )
        .join("");
    case "PascalCase":
      return value
        .split(/-/g)
        .map(val => val.charAt(0).toUpperCase() + val.substr(1))
        .join("");
    default:
      return value;
  }
};

const ConfigKey = ({
  name,
  supported = [],
  notSupported = [],
  children,
  platform,
}) => {
  return (
    <StaticQuery
      query={query}
      render={({ allPlatformsYaml: { nodes: platforms } }) => {
        return (
          <Location>
            {({ location }) => {
              if (!platform) {
                platform = normalizeSlug(
                  parse(location.search).platform || null
                );
              }
              let activePlatform =
                platforms.find(p => normalizeSlug(p.slug) === platform) || {};

              const isSupported = notSupported.length
                ? !notSupported.find(p => p === platform)
                : supported.length
                ? supported.find(p => p === platform)
                : true;

              const style = activePlatform.case_style || "canonical";
              const header = (
                <h3>
                  <code>{formatCase(style, name)}</code>
                </h3>
              );

              if (children) {
                return (
                  <div
                    className={`unsupported ${!isSupported &&
                      "is-unsupported"}`}
                  >
                    {header}
                    {!isSupported && (
                      <div className="unsupported-hint">
                        Not available for{" "}
                        {activePlatform.name || "this platform"}.
                      </div>
                    )}
                    {children}
                  </div>
                );
              }
              return header;
            }}
          </Location>
        );
      }}
    />
  );
};

ConfigKey.propTypes = {
  name: PropTypes.string.isRequired,
  platform: PropTypes.string,
  supported: PropTypes.arrayOf(PropTypes.string),
  notSupported: PropTypes.arrayOf(PropTypes.string),
};

ConfigKey.defaultProps = {
  supported: [],
  notSupported: [],
};

export default ConfigKey;
