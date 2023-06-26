import React, {Fragment} from 'react';
import {NavDropdown} from 'react-bootstrap';
import {PlatformIcon} from 'platformicons';

import {usePlatform, usePlatformList} from './hooks/usePlatform';
import {SmartLink} from './smartLink';

export function NavbarPlatformDropdown() {
  const platformList = usePlatformList();
  const [currentPlatform] = usePlatform(null, false, false);
  return (
    <NavDropdown
      title={
        currentPlatform ? (
          <Fragment>
            <PlatformIcon
              platform={currentPlatform.key}
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
            platform={platform.key}
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
