import Link from 'next/link';

import 'sentry-docs/styles/_includes/try-sentry-cta.scss';

function TrySentryCta() {
  return (
    <div className="flex items-center flex-col bg-darkPurple p-6 rounded-lg try-sentry-cta-wrapper">
      <h2 className="font-medium mb-8 text-3xl !leading-5 text-white">Fix it</h2>
      <p className="text-white leading-6 mb-4 text-center">
        Get started with the only application monitoring platform that empowers developers
        to fix application problems without compromising on velocity
      </p>
      <div className="btn-wrapper">
        <Link className="signup-btn try-btn" href="https://sentry.io/signup/">
          <span>Try sentry for free</span>
        </Link>
        <Link
          className="try-btn demo-btn"
          target="_blank"
          href="https://try.sentry-demo.com/"
          rel="noreferrer"
        >
          <span className="text-ellipsis overflow-hidden inline-block leading-5 h-4">
            Explore our sandbox
          </span>
        </Link>
      </div>
    </div>
  );
}

export default TrySentryCta;
