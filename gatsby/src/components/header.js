import PropTypes from 'prop-types';
import React from 'react';

const Header = ({ homeUrl, sitePath }) => (
  <div className="navbar navbar-expand-md navbar-light bg-white global-header">
    <a
      href={`${homeUrl}/welcome/`}
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
    </a>

    <button
      className="d-md-none btn btn-outline-dark"
      type="button"
      data-toggle="collapse"
      data-target="#sidebar"
      aria-controls="sidebar"
      aria-expanded="false"
      aria-label="Toggle table of contents"
    >
      Table of Contents
    </button>
  </div>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
  homeUrl: PropTypes.string
};

Header.defaultProps = {
  siteTitle: ''
};

export default Header;
