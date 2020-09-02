import React from "react";
import { useLocation } from "@reach/router";
import { NavDropdown } from "react-bootstrap";

import PlatformIcon from "./platformIcon";
import SmartLink from "./smartLink";
import Search from "./search";
import usePlatform, { usePlatformList } from "./hooks/usePlatform";

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
        <ul className="navbar-nav ml-auto rounded">
          <li className="nav-item mr-md-1 mr-lg-2">
            <SmartLink className="nav-link" to="/product/">
              Product
            </SmartLink>
          </li>
          <NavDropdown
            title={
              currentPlatform ? (
                <React.Fragment>
                  <PlatformIcon
                    platform={currentPlatform.key}
                    size={16}
                    style={{ marginRight: "0.5rem" }}
                  />
                  {currentPlatform.title}
                </React.Fragment>
              ) : (
                "Platforms"
              )
            }
            id="platforms"
          >
            {platformList.map(platform => (
              <NavDropdown.Item
                key={platform.key}
                active={
                  currentPlatform ? currentPlatform.key == platform.key : false
                }
                href={platform.url}
              >
                <PlatformIcon
                  platform={platform.key}
                  size={16}
                  style={{ marginRight: "0.5rem" }}
                />
                {platform.title}
              </NavDropdown.Item>
            ))}
            <NavDropdown.Divider />
            <NavDropdown.Item href="/platforms/">
              Show all platforms
            </NavDropdown.Item>
          </NavDropdown>
          <li className="nav-item mr-md-1 mr-lg-2">
            <SmartLink className="nav-link" to="/api/">
              API
            </SmartLink>
          </li>
          <li className="nav-item mr-md-1 mr-lg-2">
            <a className="nav-link" href={`https://sentry.io/`}>
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
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
