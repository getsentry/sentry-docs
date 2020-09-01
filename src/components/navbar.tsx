import React from "react";
import { useLocation } from "@reach/router";

import Search from "./search";

type Props = {
  platforms?: string[];
};

export default ({ platforms }: Props): JSX.Element => {
  const location = useLocation();

  return (
    <div className="navbar navbar-expand-md navbar-light global-header">
      <div className="collapse navbar-collapse content-max" id="navbar-menu">
        <Search path={location.pathname} platforms={platforms} />
        <ul className="navbar-nav ml-auto rounded">
          <li className="nav-item mr-md-1 mr-lg-2" data-hide-when-logged-in>
            <a className="nav-link" href={`https://sentry.io/auth/login/`}>
              Sign in
            </a>
          </li>
          <li className="nav-item" data-hide-when-logged-in>
            <div className="p-1 p-md-0">
              <a
                href={`https://sentry.io/signup/`}
                className="btn btn-primary d-block d-inline-block-md"
                role="button"
              >
                Get started
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
