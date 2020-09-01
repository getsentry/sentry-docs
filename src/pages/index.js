import React from "react";

import SEO from "../components/seo";

import "~src/css/screen.scss";

import Search from "../components/search";
import SmartLink from "../components/smartLink";

import SentryWordmarkSVG from "../logos/sentry-wordmark-dark.svg";

import JavascriptSVG from "../logos/javascript.svg";
import NodeSVG from "../logos/node.svg";
import PythonSVG from "../logos/python.svg";
import JavaSVG from "../logos/java.svg";
import PhpSVG from "../logos/php.svg";
import LaravelSVG from "../logos/laravel.svg";
import ReactNativeSVG from "../logos/reactnative.svg";
import DotNetSVG from "../logos/dotnet.svg";
import ReactSVG from "../logos/react.svg";
import SymfonySVG from "../logos/symfony.svg";
import GoSVG from "../logos/go.svg";
import CocoaSVG from "../logos/cocoa.svg";
import dotNetCoreSVG from "../logos/dotnetcore.svg";
import SwiftSVG from "../logos/swift.svg";

const IndexPage = () => {
  return (
    <div class="index-wrapper">
      <SEO title="Sentry Documentation" />
      <div class="hero-section">
        <div class="index-container">
          <div class="index-navbar">
            <a href="/" title="Sentry error monitoring" class="index-logo">
              <img src={SentryWordmarkSVG} />
            </a>
            <ul className="navbar-nav">
              <li className="nav-item" data-hide-when-logged-in>
                <a className="nav-link" href={`https://sentry.io/auth/login/`}>
                  Sign in
                </a>
              </li>
              <li className="nav-item" data-hide-when-logged-in>
                <a
                  href={`https://sentry.io/signup/`}
                  className="btn btn-primary d-block d-inline-block-md"
                  role="button"
                >
                  Get started
                </a>
              </li>
            </ul>
          </div>

          <h1>Sentry Documentation</h1>

          <div class="integrations-logo-row">
            <a href="/platforms/javascript/" class="hover-card-link">
              <div class="image-frame">
                <img src={JavascriptSVG} />
              </div>
              Javascript
            </a>
            <a href="/platforms/node/" class="hover-card-link">
              <div class="image-frame">
                <img src={NodeSVG} />
              </div>
              Node
            </a>
            <a href="/platforms/python/" class="hover-card-link">
              <div class="image-frame">
                <img src={PythonSVG} />
              </div>
              Python
            </a>
            <a href="/platforms/java/" class="hover-card-link">
              <div class="image-frame">
                <img src={JavaSVG} />
              </div>
              Java
            </a>
            <a href="/platforms/php/" class="hover-card-link">
              <div class="image-frame">
                <img src={PhpSVG} />
              </div>
              PHP
            </a>
            <a href="/platforms/laravel/" class="hover-card-link">
              <div class="image-frame">
                <img src={LaravelSVG} />
              </div>
              Laravel
            </a>
            <a href="/platforms/react-native/" class="hover-card-link">
              <div class="image-frame">
                <img src={ReactNativeSVG} />
              </div>
              React Native
            </a>
            <a href="/platforms/dotnet/" class="hover-card-link">
              <div class="image-frame">
                <img src={DotNetSVG} />
              </div>
              .NET
            </a>
            <a
              href="/platforms/javascript/guides/react/"
              class="hover-card-link"
            >
              <div class="image-frame">
                <img src={ReactSVG} />
              </div>
              React
            </a>
            <a href="/platforms/php/guides/symfony/" class="hover-card-link">
              <div class="image-frame">
                <img src={SymfonySVG} />
              </div>
              Symfony
            </a>
            <a href="/platforms/go/" class="hover-card-link">
              <div class="image-frame">
                <img src={GoSVG} />
              </div>
              Go
            </a>
            <a href="/platforms/cocoa/" class="hover-card-link">
              <div class="image-frame">
                <img src={CocoaSVG} />
              </div>
              Cocoa
            </a>
            <a
              href="/platforms/dotnet/guides/aspnetcore/"
              class="hover-card-link"
            >
              <div class="image-frame">
                <img src={dotNetCoreSVG} />
              </div>
              .NET Core
            </a>
            <a href="/platforms/cocoa/guides/swift/" class="hover-card-link">
              <div class="image-frame">
                <img src={SwiftSVG} />
              </div>
              Swift
            </a>
          </div>

          <div class="">
            <a href="/platforms/" class="hover-card-link">
              Go to all platforms
            </a>
          </div>

          <Search />
        </div>
      </div>
      <div class="index-container">
        <h2>Quick links</h2>

        <div class="flex-row card-row">
          <a class="hover-card-link" href="/api/">
            Web and Event API
          </a>
          <a class="hover-card-link" href="/self-hosted">
            Self-Hosted Sentry
          </a>
          <a class="hover-card-link" href="https://develop.sentry.io/">
            Developer Guidlines
          </a>
          <a class="hover-card-link" href="/product/">
            Product Guides
          </a>
        </div>

        <div class="flex-row link-row">
          <div>
            <h3>First steps</h3>
            <ul class="unstyled-list">
              <li>
                <a href="#">Additional Data</a>
              </li>
              <li>
                <a href="#">Breadcrumbs</a>
              </li>
              <li>
                <a href="#">User Feedback</a>
              </li>
              <li>
                <a href="#">Scopes and Hubs</a>
              </li>
              <li>
                <a href="#">Attachments</a>
              </li>
            </ul>
          </div>
          <div>
            <h3>Next things</h3>
            <ul class="unstyled-list">
              <li>
                <a href="#">Sentry Basics</a>
              </li>
              <li>
                <a href="#">Error Monitoring</a>
              </li>
              <li>
                <a href="#">Alerts & Notifications</a>
              </li>
              <li>
                <a href="#">Performance Monitoring</a>
              </li>
              <li>
                <a href="#">Releases</a>
              </li>
              <li>
                <a href="#">Discover Queries</a>
              </li>
              <li>
                <a href="#">Security Policy Reporting</a>
              </li>
              <li>
                <a href="#">Integrations</a>
              </li>
            </ul>
          </div>
          <div>
            <h3>And then</h3>
            <ul class="unstyled-list">
              <li>
                <a href="#">Grouping Events into Issues</a>
              </li>
              <li>
                <a href="#">Sensitive Data</a>
              </li>
              <li>
                <a href="#">Data Forwarding</a>
              </li>
              <li>
                <a href="#">Advanced Data Scrubbing</a>
              </li>
              <li>
                <a href="#">Debug Informatino Files</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="github-cta">
          <small>
            You can{" "}
            <SmartLink
              to={`https://github.com/getsentry/sentry-docs/edit/master/src/`}
            >
              edit this page
            </SmartLink>{" "}
            on GitHub.
          </small>
        </div>
      </div>
    </div>
  );
};

export const frontmatter = {
  title: "Sentry Documentation",
};

export default IndexPage;
