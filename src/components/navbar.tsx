import React from 'react';
import {Nav} from 'react-bootstrap';
import {useLocation} from '@reach/router';

import {NavbarPlatformDropdown} from './navbarPlatformDropdown';
import {getSandboxURL, SandboxOnly} from './sandboxLink';
import {Search} from './search';
import {SmartLink} from './smartLink';

type Props = {
  platforms?: string[];
};

export function Navbar({platforms}: Props): JSX.Element {
  const location = useLocation();

  return (
    <div className="navbar navbar-expand-sm navbar-light global-header">
      <div className="index-search" style={{width: '45rem', margin: '0 0.8rem'}}>
        <Search path={location.pathname} platforms={platforms} />
      </div>
      <div className="collapse navbar-collapse content-max" id="navbar-menu">
        <Nav className="justify-content-end" style={{flex: 1}}>
          <NavbarPlatformDropdown />
          <Nav.Item>
            <SmartLink className="nav-link" to="/product/">
              Product
            </SmartLink>
          </Nav.Item>
          <Nav.Item>
            <SmartLink className="nav-link" to="/api/">
              API
            </SmartLink>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="https://changelog.getsentry.com/">Changelog</Nav.Link>
          </Nav.Item>
          <SandboxOnly>
            <Nav.Item>
              <Nav.Link
                className="text-primary"
                href={getSandboxURL().toString()}
                target="_blank"
              >
                Sandbox
              </Nav.Link>
            </Nav.Item>
          </SandboxOnly>
          <Nav.Item>
            <Nav.Link href="https://sentry.io/">
              Sign In
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                className="bi bi-arrow-right-short"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                />
              </svg>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </div>
  );
}
