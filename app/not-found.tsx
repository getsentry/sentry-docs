import 'prism-sentry/index.css';

import {Header} from 'sentry-docs/components/header';

export default function NotFound() {
  return (
    <div className="tw-app">
      <Header pathname="/" searchPlatforms={[]} />
      <main className="pt-3 px-8 mt-8">
        <h1 className="font-medium text-3xl mb-4">Page Not Found</h1>
        <p className="text-lg">We couldn't find the page you were looking for.</p>
      </main>
    </div>
  );
}
