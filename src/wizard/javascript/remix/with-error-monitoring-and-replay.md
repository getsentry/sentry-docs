---
name: Remix
doc_link: https://docs.sentry.io/platforms/javascript/guides/remix/
support_level: production
type: framework
---

## Install

Sentry captures data by using an SDK within your application’s runtime.

```bash
# Using yarn
yarn add @sentry/remix

# Using npm
npm install --save @sentry/remix
```

## Configure

Import and initialize Sentry in your Remix entry points for both the client and server:

```javascript
import {useLocation, useMatches} from '@remix-run/react';
import * as Sentry from '@sentry/remix';
import {useEffect} from 'react';

Sentry.init({
  dsn: '___DSN___',
  integrations: [new Sentry.Replay()],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});
```

Initialize Sentry in your entry point for the server to capture exceptions and get performance metrics for your [`action`](https://remix.run/docs/en/v1/api/conventions#action) and [`loader`](https://remix.run/docs/en/v1/api/conventions#loader) functions:

```javascript
import * as Sentry from '@sentry/remix';

Sentry.init({
  dsn: '___DSN___',
});
```

Lastly, wrap your Remix root with `withSentry` to catch React component errors and to get parameterized router transactions:

```javascript
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

import {withSentry} from '@sentry/remix';

function App() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default withSentry(App);
```

## Verify

This snippet contains an intentional error and can be used as a test to make sure that everything's working as expected.

You can trigger your first event from your development environment by raising an exception somewhere within your application. An example of this would be rendering a button whose `onClick` handler attempts to invoke a method that does not exist:

```javascript
<button onClick={() => methodDoesNotExist()}>Break the world</button>
```

---

## Next Steps

- [Source Maps](https://docs.sentry.io/platforms/javascript/guides/remix/sourcemaps/): Learn how to enable readable stack traces in your Sentry errors.
- [Remix Features](https://docs.sentry.io/platforms/javascript/guides/remix/features/): Learn about our first class integration with the Remix framework.
- [Performance Monitoring](https://docs.sentry.io/platforms/javascript/guides/remix/performance/): Track down transactions to connect the dots between 10-second page loads and poor-performing API calls or slow database queries.
