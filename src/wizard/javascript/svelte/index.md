---
name: Svelte
doc_link: https://docs.sentry.io/platforms/javascript/guides/svelte/
support_level: production
type: framework
---

To instrument your Svelte application with Sentry, first install the `@sentry/svelte` package:

```bash
# Using yarn
yarn add @sentry/svelte

# Using npm
npm install --save @sentry/svelte
```

Next, import and initialize initialize Sentry in your Svelte app's entry point (`main.ts/js`):

```javascript
import "./app.css";
import App from "./App.svelte";

import * as Sentry from "@sentry/svelte";

// Initialize the Sentry SDK here
Sentry.init({
  dsn: "___PUBLIC_DSN___",
  integrations: [new Sentry.BrowserTracing()],

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

The above configuration captures both error and performance data. We recommend adjusting `tracesSampleRate` in production, see [Sampling](https://docs.sentry.io/platforms/javascript/configuration/sampling/).

After this step, Sentry will report any uncaught exceptions triggered by your application.

You can trigger your first event from your development environment by raising an exception somewhere within your application. An example of this would be rendering a button whose `on:click` handler attempts to invoke a function that doesn't exist:

```html
// SomeComponent.svelte
<button type="button" on:click="{unknownFunction}">Break the world</button>
```

Once you've verified the SDK is initialized properly and you've sent a test event, check out our [complete Svelte docs](https://docs.sentry.io/platforms/javascript/guides/svelte/) for additional configuration instructions.
