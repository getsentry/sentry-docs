import React from 'react';
import {Nav} from 'react-bootstrap';

import 'sentry-docs/css/screen.scss';

import {breadcrumb as Breadcrumbs} from './breadcrumbs';
import {Header} from './header';
import {Navbar} from './navbar';
import {NavbarPlatformDropdown} from './navbarPlatformDropdown';
import {getSandboxURL, SandboxOnly} from './sandboxLink';
import {Sidebar} from './sidebar';
import {SmartLink} from './smartLink';

type Props = {
  children: JSX.Element | JSX.Element[];
  pageContext?: {
    guide?: {
      [key: string]: any;
      name?: string;
    };
    platform?: {
      [key: string]: any;
      name?: string;
    };
  };
  sidebar?: JSX.Element;
};

export function Layout({children, sidebar, pageContext = {}}: Props): JSX.Element {
  const searchPlatforms = [pageContext.platform?.name, pageContext.guide?.name].filter(
    Boolean
  );

  return (
    <div className="document-wrapper">
      <div className="sidebar">
        <Header />

        <div
          className="d-md-flex flex-column align-items-stretch collapse navbar-collapse"
          id="sidebar"
        >
          <div className="toc">
            <div className="text-white p-3">{sidebar ? sidebar : <Sidebar />}</div>
          </div>
        </div>
        <div className="d-sm-none d-block" id="navbar-menu">
          <Nav className="justify-content-center" style={{flex: 1}}>
            <NavbarPlatformDropdown />
            <Nav.Item>
              <SmartLink className="nav-link" to="/product/">
                Product
              </SmartLink>
            </Nav.Item>
            <Nav.Item>
              <SmartLink className="nav-link" to="/api/">
                API
              </SmartLink>
            </Nav.Item>
            <SandboxOnly>
              <Nav.Item>
                <Nav.Link
                  className="text-primary"
                  href={getSandboxURL().toString()}
                  target="_blank"
                >
                  Sandbox
                </Nav.Link>
              </Nav.Item>
            </SandboxOnly>
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

      <main role="main" className="px-0">
        <div className="flex-grow-1">
          <div className="d-block navbar-right-half">
            <Navbar
              {...(searchPlatforms.length > 0 && {
                platforms: searchPlatforms,
              })}
            />
          </div>

          <section className="pt-3 px-3 content-max prose">
            <div className="pb-3">
              <Breadcrumbs />
            </div>

            {children}
          </section>
        </div>
      </main>
    </div>
  );
}
