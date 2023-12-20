import React, {Fragment} from 'react';
import {NavDropdown} from 'react-bootstrap';
import {PlatformIcon} from 'platformicons';

import {SmartLink} from './smartLink';
import { Platform, PlatformGuide } from 'sentry-docs/types';

interface Props {
  platforms: Platform[];
  currentPlatform: Platform | PlatformGuide | undefined;
};

export function NavbarPlatformDropdown({platforms: platformList, currentPlatform}: Props) {
  return (
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
  );
}
