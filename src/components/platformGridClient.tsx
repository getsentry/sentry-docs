'use client';

import styled from "@emotion/styled";
import Link from 'next/link';
import { DocNode } from "sentry-docs/docTree";
import { PlatformIcon } from 'platformicons';

type Props = {
  noGuides: boolean;
  platformNodes: DocNode[];
};

const PlatformCell = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

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
  margin-left: 1.5rem;

  h4 {
    margin: 0 0 0.5rem;
  }
`;

const GuideList = styled.div`
  font-size: 0.8em;
  width: 100%;
  text-overflow: ellipsis;

  a {
    display: inline-block;

    &:after {
      content: ', ';
      padding: 0 5px 0 0;
    }
    &:last-child:after {
      content: '';
      margin: 0;
    }
  }
`;

export function PlatformGridClient({noGuides = false, platformNodes}: Props) {
  return (
    <div className="row">
      {platformNodes
        .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title))
        .filter(platform => !platform.slug.match('perl'))
        .map(platform => {
          return (
            <div className="col-lg-6 col-md-12 platform-link mb-3" key={platform.slug}>
              <PlatformCell>
                <PlatformCellIcon>
                  <Link href={"/" + platform.path}>
                    <PlatformIcon
                      size={82}
                      platform={platform.frontmatter.icon ?? platform.slug}
                      format="lg"
                      style={{maxWidth: 'none', border: 0, boxShadow: 'none'}}
                    />
                  </Link>
                </PlatformCellIcon>
                <PlatformCellContent>
                  <Link href={"/" + platform.path}>
                    <h4>{platform.frontmatter.title}</h4>
                  </Link>

                  {/* {!noGuides && (
                    <GuideList>
                      {platform.guides.map(guide => {
                        return (
                          <Link href={guide.url} key={guide.key}>
                            {guide.title}
                          </Link>
                        );
                      })}
                    </GuideList>
                  )} */}
                </PlatformCellContent>
              </PlatformCell>
            </div>
          );
        })}
    </div>
  );
}
