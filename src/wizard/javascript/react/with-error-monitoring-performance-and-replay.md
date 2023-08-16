---
name: React
doc_link: https://docs.sentry.io/platforms/javascript/guides/react/
support_level: production
type: framework
---

<!-- * * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * *
*                          UPDATES WILL NO LONGER BE REFLECTED IN SENTRY                            *
*                                                                                                   *
* We've successfully migrated all "getting started/wizard" documents to the main Sentry repository, *
* where you can find them in the folder named "gettingStartedDocs" ->                               *
* https://github.com/getsentry/sentry/tree/master/static/app/gettingStartedDocs.                    *
*                                                                                                   *
* Find more details about the project in the concluded Epic ->                                      *
* https://github.com/getsentry/sentry/issues/48144                                                  *
*                                                                                                   *
* This document is planned to be removed in the future. However, it has not been removed yet,       *
* primarily because self-hosted users depend on it to access instructions for setting up their      *
* platform. We need to come up with a solution before removing these docs.                          *
* * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * * * -->

## Install

Sentry captures data by using an SDK within your application’s runtime.

```bash
# Using yarn
yarn add @sentry/react

# Using npm
npm install --save @sentry/react
```

## Configure

Initialize Sentry as early as possible in your application's lifecycle.

```javascript
import { createRoot } React from "react-dom/client";
import React from "react";
import * as Sentry from "@sentry/react";
import App from "./App";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const container = document.getElementById(“app”);
const root = createRoot(container);
root.render(<App />)
```

## Verify

This snippet contains an intentional error and can be used as a test to make sure that everything's working as expected.

```javascript
return <button onClick={() => methodDoesNotExist()}>Break the world</button>;
```

---

## Next Steps

- [Source Maps](https://docs.sentry.io/platforms/javascript/guides/react/sourcemaps/): Learn how to enable readable stack traces in your Sentry errors.
- [React Features](https://docs.sentry.io/platforms/javascript/guides/react/features/): Learn about our first class integration with the React framework.
- [React Router](https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/): Configure routing, so Sentry can generate parameterized transaction names for a better overview in Performance Monitoring.
