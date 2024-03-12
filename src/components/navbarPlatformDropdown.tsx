'use client';

import {Fragment} from 'react';
import {NavDropdown} from 'react-bootstrap';

import {Platform, PlatformGuide} from 'sentry-docs/types';

import {PlatformIcon} from './platformIcon';
import {SmartLink} from './smartLink';

interface Props {
  currentPlatform: Platform | PlatformGuide | undefined;
  platforms: Platform[];
}

export function NavbarPlatformDropdown({
  platforms: platformList,
  currentPlatform,
}: Props) {
  return (
    <div className="p-3 platform-dropdown">
      <NavDropdown
        title={
          currentPlatform ? (
            <Fragment>
              <PlatformIcon
                platform={currentPlatform.icon ?? currentPlatform.key}
                size={16}
                style={{marginRight: '0.5rem'}}
                format="sm"
              />
              {currentPlatform.title}
            </Fragment>
          ) : (
            'Platforms'
          )
        }
        id="nd-platforms"
      >
        {platformList.map(platform => (
          <SmartLink
            className={`dropdown-item ${
              currentPlatform && currentPlatform.key === platform.key ? 'active' : ''
            }`}
            key={platform.key}
            to={platform.url}
          >
            <PlatformIcon
              platform={platform.icon ?? platform.key}
              size={16}
              style={{marginRight: '0.5rem'}}
              format="sm"
            />
            {platform.title}
          </SmartLink>
        ))}
        <NavDropdown.Divider />
        <SmartLink className="dropdown-item" to="/platforms/">
          Show all platforms
        </SmartLink>
      </NavDropdown>
    </div>
  );
}
