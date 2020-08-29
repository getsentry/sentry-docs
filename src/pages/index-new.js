import React from "react";
import * as Sentry from "@sentry/gatsby";

import SEO from "../components/seo";

import "~src/css/screen.scss";

import Search from "../components/search";

const IndexPage = () => {
  return (
    <div class="index-container">
      <a to="/" title="Sentry error monitoring" className="index-logo pb-0">
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
      <SEO title="Page Not Found" />
      <h1>New page baby</h1>
      <Search />

      <h2>Get up and running quickly with our library of integrations</h2>

      <div class="could-it-be">
        <a href="#">
          <div class="image-frame">
            <img src="../docs/javascript.svg" />
          </div>
          Javascript
        </a>
        <a href="#">
          <div class="image-frame">
            <img src="./nodejs-icon.svg" />
          </div>
          Node
        </a>
        <a href="#">
          <div class="image-frame">
            <img src="./python-5.svg" />
          </div>
          Python
        </a>
        <a href="#">
          <div class="image-frame">
            <img src="./java-14.svg" />
          </div>
          Java
        </a>
        <a href="#">
          <div class="image-frame">
            <img src="./php-1.svg" />
          </div>
          PHP
        </a>
        <a href="#">
          <div class="image-frame">
            <img src="./laravel-2.svg" />
          </div>
          Laravel
        </a>
        <a href="#">
          <div class="image-frame">
            <img src="./react.svg" />
          </div>
          React Native
        </a>
        <a href="#">
          <div class="image-frame">
            <img src="./apple-black.svg" />
          </div>
          Cocoa
        </a>
        <a href="#">
          <div class="image-frame">
            <img src="./go-6.svg" />
          </div>
          Go
        </a>
        <a href="#">
          <div class="image-frame">
            <img src="./swift-15.svg" />
          </div>
          Swift
        </a>
        <a href="#">
          <div class="image-frame">
            <img src="./symfony.svg" />
          </div>
          Symfony
        </a>
      </div>

      <div class="flex-row link-row">
        <a href="#">Web and Event API</a>
        <a href="#">Slef-Hosted Sentry</a>
        <a href="#">Developer Guidlines</a>
      </div>

      <h2>Useful docs</h2>

      <div class="flex-row">
        <div>
          <ul>
            <li>
              <a href="#">Useful doc</a>
            </li>
            <li>
              <a href="#">Useful doc</a>
            </li>
            <li>
              <a href="#">Useful doc</a>
            </li>
            <li>
              <a href="#">Useful doc</a>
            </li>
            <li>
              <a href="#">Useful doc</a>
            </li>
          </ul>
        </div>
        <div>
          <ul>
            <li>
              <a href="#">Useful doc</a>
            </li>
            <li>
              <a href="#">Useful doc</a>
            </li>
            <li>
              <a href="#">Useful doc</a>
            </li>
            <li>
              <a href="#">Useful doc</a>
            </li>
            <li>
              <a href="#">Useful doc</a>
            </li>
          </ul>
        </div>
        <div>
          <ul>
            <li>
              <a href="#">Useful doc</a>
            </li>
            <li>
              <a href="#">Useful doc</a>
            </li>
            <li>
              <a href="#">Useful doc</a>
            </li>
            <li>
              <a href="#">Useful doc</a>
            </li>
            <li>
              <a href="#">Useful doc</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
