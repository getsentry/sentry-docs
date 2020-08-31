import React from "react";
import { StaticQuery, graphql } from "gatsby";
import { Location } from "@reach/router";

import usePlatform, { getPlatform, Guide } from "./hooks/usePlatform";
import Content from "./content";
import SmartLink from "./smartLink";

const includeQuery = graphql`
  query IncludeQuery {
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
  } = data;
  const [dropdown, setDropdown] = React.useState(null);
  const [currentPlatform, _, isFixed] = usePlatform(platform);
  const hasDropdown = !isFixed;

  const matches = files.filter(
    node => node.relativePath.indexOf(includePath) === 0
  );

  // if (!activePlatform) activePlatform = defaultPlatform;
  let contentMatch = matches.find(m =>
    slugMatches(m.name, currentPlatform.name)
  );
  if (!contentMatch && (currentPlatform as Guide).fallbackPlatform) {
    contentMatch = matches.find(m =>
      slugMatches(m.name, (currentPlatform as Guide).fallbackPlatform)
    );
  }
  if (!contentMatch) {
    console.warn(
      `Couldn't find content in ${includePath} for selected platform: ${currentPlatform.key}`
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
              {currentPlatform.title}
            </button>

            <div
              className="nav dropdown-menu"
              role="tablist"
              style={{ display: dropdown ? "block" : "none" }}
            >
              {matches.map(node => {
                const platform = getPlatform(node.name);
                if (!platform) {
                  console.warn(`Cannot find platform for ${node.name}`);
                  return null;
                }
                return (
                  <a
                    className="dropdown-item"
                    role="tab"
                    key={platform.key}
                    onClick={() => {
                      setDropdown(false);
                      navigate(`${location.pathname}?platform=${platform.key}`);
                      // TODO: retain scroll
                      // window.scrollTo(window.scrollX, window.scrollY);
                    }}
                  >
                    {platform.title}
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
