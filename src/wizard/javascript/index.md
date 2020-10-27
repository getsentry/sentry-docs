---
name: JavaScript
doc_link: https://docs.sentry.io/platforms/javascript/
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
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [
    new Integrations.BrowserTracing(),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});
```

This snippet includes an intentional error, so you can test that everything is working as soon as you set it up:

```js
myUndefinedFunction();
```

To view and resolve this intentional error, log into sentry.io and open your project. Clicking on the error's title will open a page where you can see detailed information and mark it as resolved.
