'use client';

import {Nav, NavItem} from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

import {Banner} from 'sentry-docs/components/banner';
import SentryLogoSVG from 'sentry-docs/logos/sentry-logo-dark.svg';
import {Platform, PlatformGuide} from 'sentry-docs/types';

import {PlatformIcon} from './platformIcon';
import {Search} from './search';
import {SmartLink} from './smartLink';

interface Props {
  totalPlatformCount: number;
  visiblePlatforms: Array<Platform | PlatformGuide>;
}

export function HomeClient({visiblePlatforms, totalPlatformCount}: Props) {
  const pathname = usePathname() ?? undefined;
  return (
    <div className="index-wrapper">
      <div className="hero-section">
        <div className="index-navbar-wrapper">
          <div className="index-navbar">
            <a href="/" title="Sentry error monitoring" className="index-logo">
              <Image src={SentryLogoSVG} width={54} height={50} alt="Sentry's logo" />
              Docs
            </a>
            <Nav className="justify-content-start" style={{flex: 1}}>
              <NavItem>
                <Link className="nav-link" href="/api/">
                  API
                </Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link" href="https://sentry.io/changelog">
                  Changelog
                </Link>
              </NavItem>
              <Nav.Item>
                <Nav.Link href="https://try.sentry-demo.com/demo/start/" target="_blank">
                  Sandbox
                </Nav.Link>
              </Nav.Item>
              <NavItem>
                <Link className="nav-link" href="https://sentry.io/">
                  Sign In
                </Link>
              </NavItem>
            </Nav>
            <div>
              <Search path={pathname} platforms={[]} />
            </div>
          </div>
        </div>
        <div className="index-container">
          <h1>Welcome to Sentry Docs</h1>
          <center>
            <p>
              Sentry is a developer-first error tracking and performance monitoring
              platform.
            </p>
          </center>

          <div className="index-search">
            <Search autoFocus />
          </div>
          <div className="integrations-logo-row">
            {visiblePlatforms.map(platform => (
              <SmartLink to={platform.url} className="hover-card-link" key={platform.key}>
                <div className="image-frame">
                  <PlatformIcon
                    size={48}
                    platform={platform.icon ?? platform.key}
                    format="lg"
                  />
                </div>
                {platform.title}
              </SmartLink>
            ))}
          </div>

          <div className="integrations-all">
            <a href="/platforms/" className="see-all-btn">
              See All {totalPlatformCount} Supported Platforms
            </a>
          </div>
        </div>
      </div>
      <Banner />
      <div className="index-container pad-top">
        <div className="flex-row card-row footer-btns">
          <Link href="https://develop.sentry.dev/self-hosted/">Self-Hosted Sentry</Link>
          <Link href="https://help.sentry.io/">Support</Link>
        </div>

        <h3>Learn more...</h3>
        <div className="flex-row link-row">
          <div>
            <ul className="unstyled-list">
              <li>
                <a href="/product/performance/">Performance Monitoring</a>
              </li>
              <li>
                <a href="/product/sentry-basics/tracing/distributed-tracing/">
                  Distributed Tracing
                </a>
              </li>
              <li>
                <a href="/product/session-replay/">Session Replay</a>
              </li>
              <li>
                <a href="/product/releases/health/">Release Health</a>
              </li>
              <li>
                <a href="/product/releases/">Releases</a>
              </li>
            </ul>
          </div>
          <div>
            <ul className="unstyled-list">
              <li>
                <a href="/product/sentry-basics/">Sentry Basics</a>
              </li>
              <li>
                <a href="/product/sentry-basics/environments/">Environments</a>
              </li>
              <li>
                <a href="/product/cli/">Sentry-CLI</a>
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
                <a href="/product/integrations/">Integrations</a>
              </li>
              <li>
                <a href="/product/integrations/integration-platform/">
                  Integration Platform
                </a>
              </li>
              <li>
                <a href="/product/sentry-basics/migration/">Moving to Hosted Sentry</a>
              </li>
              <li>
                <a href="/product/accounts/membership/">
                  Organization and User Management
                </a>
              </li>
              <li>
                <a href="/product/alerts-notifications/">Alerts & Notifications</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
