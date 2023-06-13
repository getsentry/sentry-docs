---
name: React
doc_link: https://docs.sentry.io/platforms/javascript/guides/react/
support_level: production
type: framework
---

In this quick guide you’ll set up `@sentry/react` for [error monitoring](https://docs.sentry.io/platforms/javascript/guides/react/) and [performance monitoring](https://docs.sentry.io/platforms/javascript/guides/react/performance/)

---

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
import { createRoot } from "react-dom/client";
import React from "react";
import * as Sentry from "@sentry/react";
import App from "./App";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  integrations: [
    new Sentry.BrowserTracing({
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    }),
  ],
  tracesSampleRate: 1.0,
});

const container = document.getElementById(“app”);
const root = createRoot(container);
root.render(<App />);
```

> **tracesSampleRate: 1.0**
> The above setting ensures that 100% of transactions will be sent to Sentry, but we recommend lowering this number in production.

## Verify

This snippet contains an intentional error and can be used as a test to make sure that everything's working as expected.

```javascript
return <button onClick={() => methodDoesNotExist()}>Break the world</button>;
```

---

## Next Steps

- [Source Maps](https://docs.sentry.io/platforms/javascript/guides/react/sourcemaps/): Learn how to enable readable stack traces in your Sentry errors.
- [React Features](https://docs.sentry.io/platforms/javascript/guides/react/features/): Learn about our first class integration with the React framework.
- [Set Up React Router](https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/): Configure routing, so Sentry can generate parameterized transaction names for a better overview in Performance Monitoring.
- [Session Replay](https://docs.sentry.io/platforms/javascript/guides/react/session-replay/): Get to the root cause of an error or latency issue faster by seeing all the technical details related to that issue in one visual replay on your web application.
