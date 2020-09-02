import React from "react";
import { graphql, useStaticQuery } from "gatsby";

import SEO from "../components/seo";

import "~src/css/screen.scss";

import Search from "../components/search";

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

const query = graphql`
  query GetAllPlatforms {
    allPlatform {
      nodes {
        key
        guides {
          key
        }
      }
    }
  }
`;

const IndexPage = () => {
  const {
    allPlatform: { nodes: platformList },
  } = useStaticQuery(query);
  const totalPlatformCount =
    platformList.length +
    platformList.map(n => n.guides.length).reduce((a, b) => a + b, 0);

  return (
    <div className="index-wrapper">
      <SEO title="Sentry Documentation" />
      <div className="hero-section">
        <div className="index-container">
          <div className="index-navbar">
            <a href="/" title="Sentry error monitoring" className="index-logo">
              <img src={SentryWordmarkSVG} />
            </a>
            <ul className="navbar-nav">
              <li className="nav-item" data-hide-when-logged-in>
                <a className="nav-link" href="https://sentry.io/">
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

          <h1>Sentry Documentation</h1>

          <div className="integrations-logo-row">
            <a href="/platforms/javascript/" className="hover-card-link">
              <div className="image-frame">
                <img src={JavascriptSVG} />
              </div>
              Javascript
            </a>
            <a href="/platforms/node/" className="hover-card-link">
              <div className="image-frame">
                <img src={NodeSVG} />
              </div>
              Node
            </a>
            <a href="/platforms/python/" className="hover-card-link">
              <div className="image-frame">
                <img src={PythonSVG} />
              </div>
              Python
            </a>
            <a href="/platforms/java/" className="hover-card-link">
              <div className="image-frame">
                <img src={JavaSVG} />
              </div>
              Java
            </a>
            <a href="/platforms/php/" className="hover-card-link">
              <div className="image-frame">
                <img src={PhpSVG} />
              </div>
              PHP
            </a>
            <a
              href="/platforms/php/guides/laravel/"
              className="hover-card-link"
            >
              <div className="image-frame">
                <img src={LaravelSVG} />
              </div>
              Laravel
            </a>
            <a href="/platforms/react-native/" className="hover-card-link">
              <div className="image-frame">
                <img src={ReactNativeSVG} />
              </div>
              React Native
            </a>
            <a href="/platforms/dotnet/" className="hover-card-link">
              <div className="image-frame">
                <img src={DotNetSVG} />
              </div>
              .NET
            </a>
            <a
              href="/platforms/javascript/guides/react/"
              className="hover-card-link"
            >
              <div className="image-frame">
                <img src={ReactSVG} />
              </div>
              React
            </a>
            <a
              href="/platforms/php/guides/symfony/"
              className="hover-card-link"
            >
              <div className="image-frame">
                <img src={SymfonySVG} />
              </div>
              Symfony
            </a>
            <a href="/platforms/go/" className="hover-card-link">
              <div className="image-frame">
                <img src={GoSVG} />
              </div>
              Go
            </a>
            <a href="/platforms/cocoa/" className="hover-card-link">
              <div className="image-frame">
                <img src={CocoaSVG} />
              </div>
              Cocoa
            </a>
            <a
              href="/platforms/dotnet/guides/aspnetcore/"
              className="hover-card-link"
            >
              <div className="image-frame">
                <img src={dotNetCoreSVG} />
              </div>
              ASP.NET Core
            </a>
            <a href="/platforms/cocoa/" className="hover-card-link">
              <div className="image-frame">
                <img src={SwiftSVG} />
              </div>
              Swift
            </a>
          </div>

          <div className="integrations-all">
            <a href="/platforms/" className="hover-card-link">
              See all {totalPlatformCount} supported platforms
            </a>
          </div>

          <div className="index-search">
            <Search />
          </div>
        </div>
      </div>
      <div className="index-container">
        <div className="flex-row card-row">
          <a className="hover-card-link" href="/product/">
            Product Guides
          </a>
          <a className="hover-card-link" href="/api/">
            Web and Event API
          </a>
          <a
            className="hover-card-link"
            href="https://develop.sentry.dev/self-hosted/"
          >
            Self-Hosted Sentry
          </a>
          <a className="hover-card-link" href="/support/">
            Support
          </a>
        </div>

        <h3>Learn more...</h3>
        <div className="flex-row link-row">
          <div>
            <ul className="unstyled-list">
              <li>
                <a href="/product/performance/getting-started/">
                  Performance Monitoring
                </a>
              </li>
              <li>
                <a href="/product/performance/distributed-tracing/">
                  Distributed Tracing
                </a>
              </li>
              <li>
                <a href="/product/alerts-notifications/">
                  Alerts & Notifications
                </a>
              </li>
              <li>
                <a href="/product/releases/">Releases</a>
              </li>
              <li>
                <a href="/product/sentry-basics/search/">
                  Sentry Basics: Search
                </a>
              </li>
            </ul>
          </div>
          <div>
            <ul className="unstyled-list">
              <li>
                <a href="/product/sentry-basics/guides/">Best Practices</a>
              </li>
              <li>
                <a href="/product/sentry-basics/environments/">Environments</a>
              </li>
              <li>
                <a href="/product/integrations/">Integrations</a>
              </li>
              <li>
                <a href="/product/discover-queries/">Discover Queries</a>
              </li>
              <li>
                <a href="/accounts/quotas/#">Quota Management</a>
              </li>
            </ul>
          </div>
          <div>
            <ul className="unstyled-list">
              <li>
                <a href="/product/integrations/integration-platform/">
                  Integration Platform
                </a>
              </li>
              <li>
                <a href="/product/sentry-basics/guides/migration/">
                  Moving to Hosted Sentry
                </a>
              </li>
              <li>
                <a href="/accounts/membership/">
                  Organization and User Management
                </a>
              </li>
              <li>
                <a href="/product/performance/metrics/">Performance Metrics</a>
              </li>
              <li>
                <a href="/product/releases/health/">Monitor Release Health</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export const frontmatter = {
  title: "Sentry Documentation",
};

export default IndexPage;
