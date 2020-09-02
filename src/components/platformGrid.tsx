import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import styled from "@emotion/styled";

import PlatformIcon from "./platformIcon";
import SmartLink from "./smartLink";

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
  width: 100%;
  height: 116px;

  overflow: hidden;

  background: #fff;
  color: purple;
  border: 1px solid #fff;
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;
  line-height: 1.5;
  transition-property: transform, box-shadow, border-color;
  transition-duration: 0.25s;
  transition-timing-function: ease-out;
  box-shadow: 0px 2px 4px rgba(64, 30, 76, 0.1);
`;

const PlatformCellIcon = styled.div`
  width: 82px;
  height: 82px;
`;

const PlatformCellContent = styled.div`
  flex: 1;
  margin-left: 0.5rem;

  h4 {
    margin: 0 0 0.5rem;
  }
`;

const GuideList = styled.div`
  font-size: 0.8em;
  width: 100%;
  height: 54px;
  overflow: hidden;
  text-overflow: ellipsis;

  a {
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
            <div className="col-lg-6 col-md-12 platform-link mb-3">
              <PlatformCell>
                <PlatformCellIcon>
                  <SmartLink to={platform.url}>
                    <PlatformIcon size={82} platform={platform.key} />
                  </SmartLink>
                </PlatformCellIcon>
                <PlatformCellContent>
                  <SmartLink to={platform.url}>
                    <h4>{platform.title}</h4>
                  </SmartLink>

                  <GuideList>
                    {platform.guides.map(guide => {
                      return (
                        <SmartLink to={guide.url}>{guide.title}</SmartLink>
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
