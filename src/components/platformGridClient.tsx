'use client';

import styled from '@emotion/styled';

import {Platform} from 'sentry-docs/types';

import {PlatformIcon} from './platformIcon';
import {SmartLink} from './smartLink';

type Props = {
  noGuides: boolean;
  platforms: Platform[];
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

const PlatformGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  margin-bottom: 1.5rem;
`;

export function PlatformGridClient({noGuides = false, platforms}: Props) {
  return (
    <div className="max-w-4xl">
      <PlatformGrid>
        {platforms
          .sort((a, b) => (a.title || '').localeCompare(b.title || ''))
          .filter(platform => !platform.key.match('perl'))
          .map(platform => {
            return (
              <PlatformCell key={platform.key}>
                <PlatformCellIcon>
                  <SmartLink to={platform.url}>
                    <PlatformIcon
                      size={82}
                      platform={platform.icon ?? platform.key}
                      format="lg"
                      style={{border: 0, boxShadow: 'none', borderRadius: '0.25rem'}}
                    />
                  </SmartLink>
                </PlatformCellIcon>
                <PlatformCellContent>
                  <SmartLink to={platform.url}>
                    <h4>{platform.title}</h4>
                  </SmartLink>

                  {!noGuides && (
                    <GuideList>
                      {platform.guides.map(guide => {
                        return (
                          <SmartLink to={guide.url} key={guide.key}>
                            {guide.title}
                          </SmartLink>
                        );
                      })}
                    </GuideList>
                  )}
                </PlatformCellContent>
              </PlatformCell>
            );
          })}
      </PlatformGrid>
    </div>
  );
}
