import 'prism-sentry/index.css';

import {Header} from 'sentry-docs/components/header';

import 'sentry-docs/styles/screen.scss';

export default function NotFound() {
  return (
    <div className="document-wrapper">
      <div className="sidebar">
        <Header />

        <div
          className="d-md-flex flex-column align-items-stretch collapse navbar-collapse"
          id="sidebar"
        >
          <div className="toc">
            <div className="text-white p-3" />
          </div>
        </div>
        <div className="d-sm-none d-block" id="navbar-menu" />
      </div>
      <main role="main" className="px-0">
        <div className="flex-grow-1">
          <div className="d-block navbar-right-half" />

          <section className="pt-3 px-3 content-max prose2">
            <div className="pb-3" />
            <h1>Page Not Found</h1>
            <p>We couldn't find the page you were looking for.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
