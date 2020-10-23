import React from "react";
import { useLocation } from "@reach/router";
import { Nav } from "react-bootstrap";

import Search from "./search";
import SmartLink from "./smartLink";

import NavbarProductDropdown from "./navbarProductDropdown";
import NavbarPlatformDropdown from "./navbarPlatformDropdown";

type Props = {
  platforms?: string[];
};

export default ({ platforms }: Props): JSX.Element => {
  const location = useLocation();

  return (
    <div className="navbar navbar-expand-md navbar-light global-header">
      <div className="collapse navbar-collapse content-max" id="navbar-menu">
        <Search path={location.pathname} platforms={platforms} />
        <Nav className="justify-content-end" style={{ flex: 1 }}>
          <NavbarProductDropdown />
          <NavbarPlatformDropdown />
          <Nav.Item>
            <SmartLink className="nav-link" to="/api/">
              API
            </SmartLink>
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
};
