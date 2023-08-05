import React, {Fragment, useState} from 'react';
import {graphql, useStaticQuery} from 'gatsby';

import {Platform, PlatformGuide} from 'sentry-docs/types';

import {getPlatform, getPlatformsWithFallback, usePlatform} from './hooks/usePlatform';
import {Content} from './content';
import {SmartLink} from './smartLink';

const includeQuery = graphql`
  query PlatformContentQuery {
    allFile(filter: {sourceInstanceName: {eq: "platform-includes"}}) {
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
  if (slug1 === 'browser') {
    slug1 = 'javascript';
  }
  if (slug2 === 'browser') {
    slug2 = 'javascript';
  }
  return slug1 === slug2;
};

type FileNode = {
  childMdx: {
    body: any;
  };
  id: string;
  name: string;
  relativePath: string;
};

type Props = {
  includePath: string;
  children?: React.ReactNode;
  fallbackPlatform?: string;
  platform?: string;
};

const getFileForPlatform = (
  fileList: FileNode[],
  platform: Platform | PlatformGuide
): FileNode | null => {
  const platformsToSearch = getPlatformsWithFallback(platform);
  platformsToSearch.push('_default');

  const contentMatch = platformsToSearch
    .map(name => name && fileList.find(m => slugMatches(m.name, name)))
    .find(m => m);
  return contentMatch;
};

export function PlatformContent({includePath, platform, children}: Props) {
  const {
    allFile: {nodes: files},
  } = useStaticQuery(includeQuery);
  const [dropdown, setDropdown] = useState(null);
  const [currentPlatform, setPlatform, isFixed] = usePlatform(platform);
  const hasDropdown = !isFixed;

  const matches = files.filter(node => node.relativePath.indexOf(includePath) === 0);

  const contentMatch = getFileForPlatform(matches, currentPlatform);

  if (!contentMatch && !children) {
    // children is used to conditionally show introductory paragraph if the
    // snippet exists. in case children is null, it is unlikely that the page
    // is correctly written to deal with missing snippets and the correct
    // course of action is probably to hide the page for the affected platform
    throw new Error(
      `Couldn't find content in ${includePath} for selected platform: ${currentPlatform.key}`
    );
  }

  if (!contentMatch) {
    return null;
  }

  if (hasDropdown) {
    throw new Error(`${includePath} has a dropdown??`);
  }

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
              style={{display: dropdown ? 'block' : 'none'}}
            >
              {matches.map(node => {
                const nodePlatform = getPlatform(node.name);
                if (!nodePlatform) {
                  // eslint-disable-next-line no-console
                  console.warn(`Cannot find platform for ${node.name}`);
                  return null;
                }
                return (
                  <a
                    className="dropdown-item"
                    role="tab"
                    key={nodePlatform.key}
                    style={{cursor: 'pointer'}}
                    onClick={() => {
                      setDropdown(false);
                      setPlatform(nodePlatform.key);
                      // TODO: retain scroll
                      // window.scrollTo(window.scrollX, window.scrollY);
                    }}
                  >
                    {nodePlatform.title}
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
          <Fragment>
            {children || null}
            <Content key={contentMatch.id} file={contentMatch} />
          </Fragment>
        </div>
      </div>
    </section>
  );
}
