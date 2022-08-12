---
name: Svelte
doc_link: https://docs.sentry.io/platforms/javascript/guides/svelte/
support_level: production
type: framework
---

To instrument your Svelte application with Sentry, first install the `@sentry/svelte` and `@sentry/tracing` packages:

```bash
# Using yarn
yarn add @sentry/svelte @sentry/tracing

# Using npm
npm install --save @sentry/svelte @sentry/tracing
```

Next, import and initialize initialize Sentry in your Svelte app's entry point (`main.ts/js`):

```javascript
import "./app.css";
import App from "./App.svelte";

import * as Sentry from "@sentry/svelte";
import { BrowserTracing } from "@sentry/tracing";

// Initialize the Sentry SDK here
Sentry.init({
  dsn: "___PUBLIC_DSN___",
  release: "my-project-name@2.3.12",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const app = new App({
  target: document.getElementById("app"),
});

export default app;
```

Once you've verified the library is initialized properly and sent a test event, consider visiting our [complete Svelte docs](https://docs.sentry.io/platforms/javascript/guides/svelte/). There, you'll find additional instructions for configuring the Svelte SDK.
