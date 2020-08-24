import React from "react";

import { useLocation } from "@reach/router";
import Search from "./search";
import queries from "../utils/algolia";

const searchIndices = queries.map(query => ({
  name: query.indexName,
  title: `Docs`,
  hitComp: `PageHit`,
}));

const Navbar = ({ homeUrl, sitePath }) => {
  const location = useLocation();
  let filters = [];
  let match;

  if (match = location.pathname.match(/^\/platforms\/guides\/(.*)/)) {
    filters.push(`${match[1]}<score=10>`);
  } else if (match = location.pathname.match(/^\/platforms\/(.*)/)) {
    filters.push(`${match[1]}<score=5>`);
  }

  return <div className="navbar navbar-expand-md navbar-light global-header">
    <div className="collapse navbar-collapse content-max" id="navbar-menu">
      <Search collapse indices={searchIndices} filters={filters} />
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
  </div>;
};

export default Navbar;
