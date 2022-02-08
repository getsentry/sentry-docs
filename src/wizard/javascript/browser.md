---
name: Browser JavaScript
doc_link: https://docs.sentry.io/platforms/guides/javascript/
support_level: production
type: language
---

Install our JavaScript browser SDK using either `yarn` or `npm`:

```bash {tabTitle: ESM}
# Using yarn
yarn add @sentry/browser @sentry/tracing
# Using npm
npm install --save @sentry/browser @sentry/tracing
```

We also support alternate [installation methods](/platforms/javascript/install/).

`init` the Sentry Browser SDK as soon as possible during your page load:

```javascript
import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
```

We recommend adjusting the value of `tracesSampleRate` in production. Learn more about configuring sampling in our [full documentation](https://docs.sentry.io/platforms/javascript/configuration/sampling/).

Then create an intentional error, so you can test that everything is working:

```javascript
myUndefinedFunction();
```

If you're new to Sentry, use the email alert to access your account and complete a product tour.

If you're an existing user and have disabled alerts, you won't receive this email.
