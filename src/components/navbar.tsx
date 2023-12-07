'use client';

import Link from 'next/link';
import {Nav} from 'react-bootstrap';

import {Search} from './search';

type Props = {
  platforms?: string[];
};

export function Navbar({platforms}: Props) {
  return (
    <div className="navbar navbar-expand-sm navbar-light global-header">
      <div>
        <Search path={''} platforms={platforms} />
      </div>
      <div className="collapse navbar-collapse content-max" id="navbar-menu">
        <Nav className="justify-content-end" style={{flex: 1}}>
          <Nav.Item>
            <Link className="nav-link" href="/product/">
              Product
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" href="/api/">
              API
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="https://changelog.getsentry.com/">Changelog</Nav.Link>
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
  )
  return null;
};
