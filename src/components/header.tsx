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
    <div className="navbar navbar-expand-md navbar-light bg-white global-header">
      <SmartLink
        to="/"
        title="Sentry error monitoring"
        className="navbar-brand pb-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 75">
          <g height="75" width="75" className="loader-spin">
            <path
              d="M7.8 49.78c-1.75 2.88-3.19 5.4-4.35 7.56a3.9 3.9 0 0 0 3.34 6h18.86a25.75 25.75 0 0 0-12.87-22.19c1.9-3.17 5.12-9 6.32-11a38.47 38.47 0 0 1 19.14 33.23h12.63a50.79 50.79 0 0 0-25.51-44C29.65 12 32.38 7 33.89 4.64a4 4 0 0 1 6.66 0C42 7 69.53 54.8 71 57.34a4 4 0 0 1-3.75 6h-6.79"
              fill="none"
              stroke="currentColor"
              className="loader-stroke loading"
              strokeWidth="5"
            />
          </g>
        </svg>
        <h6>Docs</h6>
      </SmartLink>

      <button
        className="d-md-none btn btn-outline-dark"
        type="button"
        onClick={() => {
          const el = document.getElementById("sidebar");
          if (el.style.display === "block") {
            el.style.display = "none";
          } else {
            el.style.display = "block";
          }
        }}
        aria-controls="sidebar"
        aria-expanded="false"
        aria-label="Toggle table of contents"
      >
        Table of Contents
      </button>

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
