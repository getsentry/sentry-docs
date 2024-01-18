"use client";

import {Nav, NavItem} from 'react-bootstrap';
import Image from 'next/image';
import SentryWordmarkSVG from 'sentry-docs/logos/sentry-wordmark-dark.svg';
import Link from 'next/link';

export function Navbar() {
  return (
    <div className="index-wrapper">
      <div className="hero-section">
        <div className="index-container">
          <div className="index-navbar">
            <a href="/" title="Sentry error monitoring" className="index-logo">
              <Image
                src={SentryWordmarkSVG}
                alt="Sentry's logo" />
            </a>
            <Nav className="justify-content-end" style={{flex: 1}}>
              
              <NavItem>
                <Link className="nav-link" href="/changelog">Changelog</Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link" href="https://sentry.io/">
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
                </Link>
              </NavItem>
            </Nav>
          </div>

          <h1>Sentry Changelog</h1>
          <center>
            <p>
            Stay up to date on everything big and small, from product updates to SDK changes with the Sentry Changelog.
            </p>
          </center>
        </div>
      </div>
    </div>
  );
}
