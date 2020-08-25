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
        id
        relativePath
        name
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

const slugMatches = (slug1: string, slug2: string): boolean => {
  if (slug1 === "browser") slug1 = "javascript";
  if (slug2 === "browser") slug2 = "javascript";
  return slug1 === slug2;
};

type PlatformNode = {
  name: string;
  slug: string;
};

type FileNode = {
  id: string;
  relativePath: string;
  name: string;
  childMdx: {
    internal: {
      type: string;
    };
    body: any;
  };
};

type Props = {
  includePath: string;
  platform?: string;
};

type ChildProps = Props & {
  location: any;
  navigate: any;
  data: {
    allFile: {
      nodes: FileNode[];
    };
    allPlatformsYaml: {
      nodes: PlatformNode[];
    };
  };
};

const PlatformContent = ({
  data,
  location,
  navigate,
  includePath,
  platform,
}: ChildProps): JSX.Element => {
  const {
    allFile: { nodes: files },
    allPlatformsYaml: { nodes: platforms },
  } = data;
  const [dropdown, setDropdown] = React.useState(null);
  const hasDropdown = !platform;

  if (!platform) {
    const qsPlatform = parse(location.search).platform;
    if (qsPlatform instanceof Array) {
      platform = qsPlatform[0];
    } else {
      platform = qsPlatform || null;
    }
  }

  const matches = files.filter(
    node => node.relativePath.indexOf(includePath) === 0
  );
  const defaultPlatform = platforms.find(p =>
    matches.find(m => slugMatches(m.name, p.slug))
  );

  let activePlatform =
    platforms.find(p => slugMatches(p.slug, platform)) || defaultPlatform;
  if (!activePlatform) activePlatform = defaultPlatform;
  const contentMatch = matches.find(m =>
    slugMatches(m.name, activePlatform.slug)
  );
  if (!contentMatch) {
    console.warn(
      `Couldn't find content in ${includePath} for selected platform: ${activePlatform.slug}`
    );
  }

  return (
    <div className="platform-specific-content">
      {hasDropdown && (
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
                const platform = platforms.find(p =>
                  slugMatches(p.slug, node.name)
                );
                if (!platform) {
                  throw new Error(`Cannot find platform for ${node.name}`);
                }
                return (
                  <a
                    className="dropdown-item"
                    role="tab"
                    key={platform.slug}
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
      )}

      <div className="tab-content">
        <div className="tab-pane show active">
          {contentMatch && (
            <Content key={contentMatch.id} file={contentMatch} />
          )}
        </div>
      </div>
    </div>
  );
};

export default (props: Props): JSX.Element => {
  return (
    <StaticQuery
      query={includeQuery}
      render={data => {
        return (
          <Location>
            {({ location, navigate }) => (
              <PlatformContent
                location={location}
                navigate={navigate}
                data={data}
                {...props}
              />
            )}
          </Location>
        );
      }}
    />
  );
};
