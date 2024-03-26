'use client';

import {Fragment} from 'react';
import {NavDropdown} from 'react-bootstrap';

import {PlatformGuide} from 'sentry-docs/types';

import {PlatformIcon} from './platformIcon';
import {SmartLink} from './smartLink';

interface Props {
  currentGuide: PlatformGuide | undefined;
  guides: PlatformGuide[];
}

export function GuideDropdown({currentGuide, guides}: Props) {
  if (guides.length === 0) {
    return null;
  }

  return (
    <NavDropdown
      title={
        currentGuide ? (
          <Fragment>
            <PlatformIcon
              platform={currentGuide.icon ?? currentGuide.key}
              size={16}
              style={{marginRight: '0.5rem'}}
              format="sm"
            />
            {currentGuide.title}
          </Fragment>
        ) : (
          'Guides'
        )
      }
      id="nd-platforms"
      className="dropdown-fw"
    >
      {guides.map(guide => (
        <SmartLink
          className={`dropdown-item ${
            currentGuide && currentGuide.key === guide.key ? 'active' : ''
          }`}
          key={guide.key}
          to={guide.url}
        >
          <PlatformIcon
            platform={guide.icon ?? guide.key}
            size={16}
            style={{marginRight: '0.5rem'}}
            format="sm"
          />
          {guide.title}
        </SmartLink>
      ))}
    </NavDropdown>
  );
}
