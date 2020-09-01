import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import styled from "@emotion/styled";

import PlatformIcon from "./platformIcon";
import SmartLink from "./smartLink";
import { sortBy } from "../utils";

const query = graphql`
  query PlatformGridQuery {
    allPlatform {
      nodes {
        key
        name
        title
        url
        guides {
          key
          name
          title
          url
        }
      }
    }
  }
`;

const PlatformCell = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PlatformCellIcon = styled.div`
  width: 64px;
  height: 64px;
`;

const PlatformCellContent = styled.div`
  flex: 1;
  margin-left: 0.5rem;

  h4 {
    margin: 0 0 0.5rem;
  }
`;

const GuideList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.8em;

  li {
    display: inline-block;

    &:after {
      content: ", ";
      padding: 0 5px 0 0;
    }
    &:last-child:after {
      content: "";
      margin: 0;
    }
  }
`;

export default (): JSX.Element => {
  const {
    allPlatform: { nodes: platformList },
  } = useStaticQuery(query);
  return (
    <div className="row">
      {platformList
        .sort((a, b) => a.title.localeCompare(b.title))
        .map(platform => {
          return (
            <div className="col-4 col-sm-6 platform-link mb-3">
              <PlatformCell>
                <PlatformCellIcon>
                  <SmartLink to={platform.url}>
                    <PlatformIcon platform={platform.key} />
                  </SmartLink>
                </PlatformCellIcon>
                <PlatformCellContent>
                  <SmartLink to={platform.url}>
                    <h4>{platform.title}</h4>
                  </SmartLink>

                  <GuideList>
                    {platform.guides.map(guide => {
                      return (
                        <li key={guide.key}>
                          <SmartLink to={guide.url}>{guide.title}</SmartLink>
                        </li>
                      );
                    })}
                  </GuideList>
                </PlatformCellContent>
              </PlatformCell>
            </div>
          );
        })}
    </div>
  );
};
