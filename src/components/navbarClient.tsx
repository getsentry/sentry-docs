'use client';

import {Nav} from 'react-bootstrap';
import {usePathname} from 'next/navigation';

import {Platform, PlatformGuide} from 'sentry-docs/types';

import {Search} from './search';
import {SmartLink} from './smartLink';

interface Props {
  currentPlatform: Platform | PlatformGuide | undefined;
}

export function NavbarClient({currentPlatform}: Props) {
  const pathname = usePathname() ?? undefined;
  let searchPlatforms: string[] | undefined;
  if (currentPlatform) {
    searchPlatforms = [currentPlatform.name];
    if ('platform' in currentPlatform) {
      // currentPlatform is a PlatformGuide, so include its platform name too.
      searchPlatforms.unshift(currentPlatform.platform);
    }
  }

  return (
    <div className="navbar navbar-expand-sm navbar-light global-header">
      <div>
        <Search path={pathname} platforms={searchPlatforms} />
      </div>
      <div className="collapse navbar-collapse content-max" id="navbar-menu">
        <Nav className="justify-content-end" style={{flex: 1}}>
          <Nav.Item>
            <SmartLink className="nav-link" href="/product/">
              Product
            </SmartLink>
          </Nav.Item>
          <Nav.Item>
            <SmartLink className="nav-link" href="/api/">
              API
            </SmartLink>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="https://sentry.io/changelog">Changelog</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className="text-primary"
              href="https://try.sentry-demo.com/demo/start/"
              target="_blank"
            >
              Sandbox
            </Nav.Link>
          </Nav.Item>
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
