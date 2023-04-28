---
name: AngularJS
doc_link: https://docs.sentry.io/platforms/javascript/guides/angular/angular1/
support_level: production
type: framework
---

## Install

Sentry captures data by using an SDK within your application’s runtime.

```bash
# Using yarn
yarn add @sentry/browser @sentry/integrations

# Using npm
npm install --save @sentry/browser @sentry/integrations
```

## Configure

Initialize Sentry as early as possible in your application's lifecycle.

```javascript
import angular from "angular";
import * as Sentry from "@sentry/browser";
import { Angular as AngularIntegration } from "@sentry/integrations";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  integrations: [
    new AngularIntegration(),
      tracePropagationTargets: ["localhost", "https://yourserver.io/api"],
    }),
  ],
});

// Finally require ngSentry as a dependency in your application module.
angular.module("yourApplicationModule", ["ngSentry"]);
```

## Verify

This snippet contains an intentional error and can be used as a test to make sure that everything's working as expected.

```javascript
myUndefinedFunction();
```

---

## Next Steps

- [Source Maps](https://docs.sentry.io/platforms/javascript/guides/angular/sourcemaps/): Learn how to enable readable stack traces in your Sentry errors.
- [AngularJS Features](https://docs.sentry.io/platforms/javascript/guides/angular/angular1/): Learn about our first class integration with the AngularJS framework.
- [Performance Monitoring](https://docs.sentry.io/platforms/javascript/guides/angular/performance/): Track down transactions to connect the dots between 10-second page loads and poor-performing API calls or slow database queries.
- [Session Replay](https://docs.sentry.io/platforms/javascript/guides/angular/session-replay/): Get to the root cause of an error or latency issue faster by seeing all the technical details related to that issue in one visual replay on your web application.
