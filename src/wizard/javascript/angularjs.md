---
name: AngularJS
doc_link: https://docs.sentry.io/platforms/javascript/guides/angular/angular1/
support_level: production
type: framework
---

Install our Browser Angular SDK using either `yarn` or `npm`:

Add the Sentry SDK as a dependency using `yarn` or `npm`:

```bash
# Using yarn
yarn add @sentry/browser @sentry/integrations

# Using npm
npm install --save @sentry/browser @sentry/integrations
```

`init` the Sentry Browser SDK as soon as possible during your page load, before initializing Angular:

```javascript
import angular from "angular";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
import { Angular as AngularIntegration } from "@sentry/integrations";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  integrations: [
    new AngularIntegration(),
    new Integrations.BrowserTracing({
      tracingOrigins: ["localhost", "https://yourserver.io/api"],
    }),
  ],
  tracesSampleRate: 1.0,
});

// Finally require ngSentry as a dependency in your application module.
angular.module("yourApplicationModule", ["ngSentry"]);
```

We recommend adjusting the value of `tracesSampleRate` in production. Learn more about configuring sampling in our [full documentation](https://docs.sentry.io/platforms/javascript/performance/sampling/).

