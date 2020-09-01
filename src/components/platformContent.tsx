import React from "react";
import { StaticQuery, graphql } from "gatsby";

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
  children?: React.ReactNode;
  fallbackPlatform?: string;
};

type ChildProps = Props & {
  data: {
    allFile: {
      nodes: FileNode[];
    };
  };
};

const PlatformContent = ({
  data,
  includePath,
  platform,
  fallbackPlatform,
  children,
}: ChildProps): JSX.Element => {
  const {
    allFile: { nodes: files },
  } = data;
  const [dropdown, setDropdown] = React.useState(null);
  const [currentPlatform, setPlatform, isFixed] = usePlatform(platform);
  const hasDropdown = !isFixed;

  const matches = files.filter(
    node => node.relativePath.indexOf(includePath) === 0
  );

  let activePlatform = currentPlatform;
  // if (!activePlatform) activePlatform = defaultPlatform;
  let contentMatch = matches.find(m =>
    slugMatches(m.name, currentPlatform.key)
  );
  if (!contentMatch && (currentPlatform as Guide).fallbackPlatform) {
    const guideFallbackPlatform = (currentPlatform as Guide).fallbackPlatform;
    if (
      (contentMatch = matches.find(m =>
        slugMatches(m.name, guideFallbackPlatform)
      ))
    ) {
      activePlatform = getPlatform(guideFallbackPlatform);
    }
  }
  if (!contentMatch && fallbackPlatform) {
    if (
      (contentMatch = matches.find(m => slugMatches(m.name, fallbackPlatform)))
    ) {
      activePlatform = getPlatform(fallbackPlatform);
    }
  }
  if (!contentMatch) {
    if ((contentMatch = matches.find(m => m.name === "_default"))) {
      activePlatform = currentPlatform;
    }
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
              {activePlatform.title}
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
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setDropdown(false);
                      setPlatform(platform.key);
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
            <React.Fragment>
              {children || null}
              <Content key={contentMatch.id} file={contentMatch} />
            </React.Fragment>
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
        return <PlatformContent data={data} {...props} />;
      }}
    />
  );
};
