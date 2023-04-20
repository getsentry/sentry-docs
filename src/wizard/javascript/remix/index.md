---
name: Remix
doc_link: https://docs.sentry.io/platforms/javascript/guides/remix/
support_level: production
type: framework
---

To instrument your Remix application with Sentry, first install the `@sentry/remix` package:

```bash
# Using yarn
yarn add @sentry/remix

# Using npm
npm install --save @sentry/remix
```

Next, import and initialize Sentry in your Remix entry points for both the client and server:

```javascript
import { useLocation, useMatches } from "@remix-run/react";
import * as Sentry from "@sentry/remix";
import { useEffect } from "react";

Sentry.init({
  dsn: "___DSN___",
  tracesSampleRate: 1,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.remixRouterInstrumentation(
        useEffect,
        useLocation,
        useMatches
      ),
    }),
  ],
});
```

Initialize Sentry in your entry point for the server to capture exceptions and get performance metrics for your [`action`](https://remix.run/docs/en/v1/api/conventions#action) and [`loader`](https://remix.run/docs/en/v1/api/conventions#loader) functions. You can also initialize Sentry's database integrations, such as Prisma, to get spans for your database calls:

```javascript
import { prisma } from "~/db.server";

import * as Sentry from "@sentry/remix";

Sentry.init({
  dsn: "___DSN___",
  tracesSampleRate: 1,
  integrations: [new Sentry.Integrations.Prisma({ client: prisma })],
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
} from "@remix-run/react";

import { withSentry } from "@sentry/remix";

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

After this step, Sentry will report any uncaught exceptions triggered by your application.

You can trigger your first event from your development environment by raising an exception somewhere within your application. An example of this would be rendering a button whose `onClick` handler attempts to invoke a method that does not exist:

```javascript
<button onClick={() => methodDoesNotExist()}>
  Break the world
</button>
```

Once you've verified the SDK is initialized properly and sent a test event, check out our [complete Remix docs](https://docs.sentry.io/platforms/javascript/guides/remix/)for additional configuration instructions.
