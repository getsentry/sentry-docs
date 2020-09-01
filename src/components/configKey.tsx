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

const normalizeSlug = (slug: string) => {
  switch (slug) {
    case "browser":
      return "javascript";
    case "browsernpm":
      return "javascript";
    default:
      return slug;
  }
};

const formatCase = (style: string, value: string): string => {
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

type Props = {
  name: string;
  supported?: string[];
  notSupported?: string[];
  children?: React.ReactNode;
  platform?: string;
};

type PlatformNode = {
  name?: string;
  slug?: string;
  case_style?: string;
};

type ChildProps = Props & {
  location: any;
  data: {
    allPlatformsYaml: {
      nodes: PlatformNode[];
    };
  };
};

export const ConfigKey = ({
  name,
  supported = [],
  notSupported = [],
  children,
  platform,
  location,
  data,
}: ChildProps): JSX.Element => {
  const {
    allPlatformsYaml: { nodes: platforms },
  } = data;
  if (!platform) {
    const qsPlatform = parse(location.search).platform;
    if (qsPlatform instanceof Array) {
      platform = normalizeSlug(qsPlatform[0]);
    } else {
      platform = normalizeSlug(qsPlatform || null);
    }
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
      <div className={`unsupported ${!isSupported && "is-unsupported"}`}>
        {header}
        {!isSupported && (
          <div className="unsupported-hint">
            Not available for {activePlatform.name || "this platform"}.
          </div>
        )}
        {children}
      </div>
    );
  }
  return header;
};

export default (props: Props): JSX.Element => {
  return (
    <StaticQuery
      query={query}
      render={data => {
        return (
          <Location>
            {({ location }) => (
              <ConfigKey data={data} location={location} {...props} />
            )}
          </Location>
        );
      }}
    />
  );
};
