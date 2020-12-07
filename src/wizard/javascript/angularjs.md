---
name: AngularJS
doc_link: https://docs.sentry.io/platforms/javascript/guides/angular/angular1/
support_level: production
type: framework
---

To use Sentry with your Angular application, you will need to use `@sentry/angular` (Sentry’s Browser Angular SDK).

Add the Sentry SDK as a dependency using `yarn` or `npm`:

```bash
# Using yarn
yarn add @sentry/browser @sentry/integrations

# Using npm
npm install --save @sentry/browser @sentry/integrations
```

You should `init` the Sentry browser SDK as soon as possible during your application load up, before initializing Angular:

```javascript
import angular from "angular";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
import { Angular as AngularIntegration } from "@sentry/integrations";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  autoSessionTracking: true,
  integrations: [
    new AngularIntegration(),
    new Integrations.BrowserTracing({
      tracingOrigins: ["localhost", "https://yourserver.io/api"],
    }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

// Finally require ngSentry as a dependency in your application module.
angular.module("yourApplicationModule", ["ngSentry"]);
```
