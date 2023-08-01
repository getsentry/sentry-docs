---
name: Svelte
doc_link: https://docs.sentry.io/platforms/javascript/guides/svelte/
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
  integrations: [
    new Sentry.BrowserTracing({
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    }),
  ],

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
