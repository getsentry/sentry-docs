import React from "react";
import { useLocation } from "@reach/router";
import { Nav, NavDropdown } from "react-bootstrap";
import PlatformIcon from "platformicons";

import Search from "./search";
import SmartLink from "./smartLink";
import usePlatform, { usePlatformList } from "./hooks/usePlatform";

import NavbarProductDropdown from "./navbarProductDropdown";

type Props = {
  platforms?: string[];
};

export default ({ platforms }: Props): JSX.Element => {
  const location = useLocation();
  const platformList = usePlatformList();
  const [currentPlatform] = usePlatform(null, false);

  return (
    <div className="navbar navbar-expand-md navbar-light global-header">
      <div className="collapse navbar-collapse content-max" id="navbar-menu">
        <Search path={location.pathname} platforms={platforms} />
        <Nav className="justify-content-end" style={{ flex: 1 }}>
          <NavbarProductDropdown />
          <NavDropdown
            title={
              currentPlatform ? (
                <React.Fragment>
                  <PlatformIcon
                    platform={currentPlatform.key}
                    size={16}
                    style={{ marginRight: "0.5rem" }}
                    format="lg"
                  />
                  {currentPlatform.title}
                </React.Fragment>
              ) : (
                "Platforms"
              )
            }
            id="nd-platforms"
          >
            {platformList.map(platform => (
              <SmartLink
                className={`dropdown-item ${
                  currentPlatform && currentPlatform.key == platform.key
                    ? "active"
                    : ""
                }`}
                key={platform.key}
                to={platform.url}
              >
                <PlatformIcon
                  platform={platform.key}
                  size={16}
                  style={{ marginRight: "0.5rem" }}
                  format="lg"
                />
                {platform.title}
              </SmartLink>
            ))}
            <NavDropdown.Divider />
            <SmartLink className="dropdown-item" to="/platforms/">
              Show all platforms
            </SmartLink>
          </NavDropdown>
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
