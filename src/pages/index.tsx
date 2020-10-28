import React from "react";
import PlatformIcon from "platformicons";
import { Nav } from "react-bootstrap";

import "../css/screen.scss";

import SEO from "../components/seo";
import Search from "../components/search";
import SmartLink from "../components/smartLink";
import { usePlatformList } from "../components/hooks/usePlatform";
import NavbarProductDropdown from "../components/navbarProductDropdown";
import NavbarPlatformDropdown from "../components/navbarPlatformDropdown";

import SentryWordmarkSVG from "../logos/sentry-wordmark-dark.svg";

const HIGHLIGHTED_PLATFORMS = [
  "javascript",
  "node",
  "python",
  "php",
  "ruby",
  "java",
  "javascript.react",
  "react-native",
  "python.django",
  "dotnet",
  "go",
  "php.laravel",
  "android",
  "apple",
  "java.spring-boot",
  "ruby.rails",
];

const IndexPage = () => {
  const platformList = usePlatformList();

  let totalPlatformCount = 0;
  const visiblePlatforms = [];
  platformList.forEach(platform => {
    totalPlatformCount += 1;
    if (HIGHLIGHTED_PLATFORMS.indexOf(platform.key) !== -1) {
      visiblePlatforms.push(platform);
    }
    platform.guides.forEach(guide => {
      totalPlatformCount += 1;
      if (HIGHLIGHTED_PLATFORMS.indexOf(guide.key) !== -1) {
        visiblePlatforms.push(guide);
      }
    });
  });
  visiblePlatforms.sort(
    (a, b) =>
      HIGHLIGHTED_PLATFORMS.indexOf(a.key) -
      HIGHLIGHTED_PLATFORMS.indexOf(b.key)
  );

  return (
    <div className="index-wrapper">
      <SEO title="Sentry Documentation" />
      <div className="hero-section">
        <div className="index-container">
          <div className="index-navbar">
            <a href="/" title="Sentry error monitoring" className="index-logo">
              <img src={SentryWordmarkSVG} />
            </a>
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

          <h1>Sentry Documentation</h1>

          <div className="index-search">
            <Search />
          </div>

          <div className="integrations-logo-row">
            {visiblePlatforms.map(platform => (
              <SmartLink
                to={platform.url}
                className="hover-card-link"
                key={platform.key}
              >
                <div className="image-frame">
                  <PlatformIcon size={48} platform={platform.key} format="lg" />
                </div>
                {platform.title}
              </SmartLink>
            ))}
          </div>

          <div className="integrations-all">
            <a href="/platforms/" className="hover-card-link">
              See all {totalPlatformCount} supported platforms
            </a>
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
                <a href="/product/accounts/quotas/">Quota Management</a>
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
                <a href="/product/accounts/membership/">
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
