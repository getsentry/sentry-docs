import React from "react";
import styled from "@emotion/styled";
import { graphql, useStaticQuery } from "gatsby";

import usePlatform, { getPlatform, Platform } from "./hooks/usePlatform";
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
    body: any;
  };
};

type Props = {
  includePath: string;
  platform?: string;
  children?: React.ReactNode;
  fallbackPlatform?: string;
  notateUnsupported?: boolean;
};

const getFileForPlatform = (
  includePath: string,
  fileList: FileNode[],
  platform: Platform,
  fallbackPlatform?: string
): FileNode | null => {
  const platformsToSearch = [
    platform.key,
    platform.fallbackPlatform,
    fallbackPlatform,
    "_default",
  ];
  const contentMatch = platformsToSearch
    .map(name => name && fileList.find(m => slugMatches(m.name, name)))
    .find(m => m);
  if (!contentMatch) {
    console.warn(
      `Couldn't find content in ${includePath} for selected platform: ${platform.key}`
    );
  }
  return contentMatch;
};

const MissingContent = styled.div`
  font-style: italic;
  background: var(--lightest-purple-background);
  border: 1px dashed #ccc;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;

  p:last-child {
    margin-bottom: 0;
  }
`;

export default ({
  includePath,
  platform,
  children,
  notateUnsupported = true,
}: Props): JSX.Element => {
  const {
    allFile: { nodes: files },
  } = useStaticQuery(includeQuery);
  const [dropdown, setDropdown] = React.useState(null);
  const [currentPlatform, setPlatform, isFixed] = usePlatform(platform);
  const hasDropdown = !isFixed;

  const matches = files.filter(
    node => node.relativePath.indexOf(includePath) === 0
  );

  const contentMatch = getFileForPlatform(
    includePath,
    matches,
    currentPlatform
  );

  return (
    <section className="platform-specific-content">
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
          {contentMatch ? (
            <React.Fragment>
              {children || null}
              <Content key={contentMatch.id} file={contentMatch} />
            </React.Fragment>
          ) : (
            notateUnsupported && (
              <MissingContent>
                <p>
                  The platform or SDK you've selected either does not support
                  this functionality, or it is missing from documentation.
                </p>
                <p>
                  If you think this is an error, feel free to{" "}
                  <SmartLink to="https://github.com/getsentry/sentry-docs/issues/new">
                    let us know on GitHub
                  </SmartLink>
                  .
                </p>
              </MissingContent>
            )
          )}
        </div>
      </div>
    </section>
  );
};
