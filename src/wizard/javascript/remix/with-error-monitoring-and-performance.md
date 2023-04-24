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
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.remixRouterInstrumentation(
        useEffect,
        useLocation,
        useMatches
      ),
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
});
```

Initialize Sentry in your entry point for the server to capture exceptions and get performance metrics for your [`action`](https://remix.run/docs/en/v1/api/conventions#action) and [`loader`](https://remix.run/docs/en/v1/api/conventions#loader) functions. You can also initialize Sentry's database integrations, such as Prisma, to get spans for your database calls:

```javascript
import {prisma} from '~/db.server';

import * as Sentry from '@sentry/remix';

Sentry.init({
  dsn: '___DSN___',
  integrations: [new Sentry.Integrations.Prisma({client: prisma})],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
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
- [Session Replay](https://docs.sentry.io/platforms/javascript/guides/remix/session-replay/): Get to the root cause of an error or latency issue faster by seeing all the technical details related to that issue in one visual replay on your web application.
