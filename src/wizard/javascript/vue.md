---
name: Vue
doc_link: https://docs.sentry.io/platforms/javascript/guides/vue/
support_level: production
type: framework
---

## Instrument your application

To begin collecting error and performance data from your Vue application, you'll need the following packages:

* `@sentry/vue` (Sentry's Vue SDK)
* `@sentry/tracing` (instruments performance data)

Below are instructions for using your favorite package manager, or alternatively loaded directly from our CDN.

### Using yarn or npm

Install the dependencies:

```bash
# Using yarn
yarn add @sentry/vue @sentry/tracing

# Using npm
npm install --save @sentry/vue @sentry/tracing
```

Next, initialize Sentry in your app entry point before you initialize your root component.

```javascript
import Vue from "vue";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  Vue,
  dsn: "___PUBLIC_DSN___",
  integrations: [
    new Integrations.BrowserTracing(),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});
```

### Additional Options

Additionally, the SDK accepts a few different configuration options that let you change its behavior:

- Passing in `Vue` is optional, but if you do not pass it `window.Vue` must be present.
- Passing in `attachProps` is optional and is `true` if it is not provided. If you set it to `false`, Sentry will suppress sending all Vue components' props for logging.
- Passing in `logErrors` is optional and is `false` if it is not provided. If you set it to `true`, Sentry will call Vue's original `logError` function as well.

<div class="alert alert-warning" role="alert"><h5 class="no_toc">Vue Error Handling</h5><div class="alert-body content-flush-bottom">
Please note that if you enable this integration, by default Vue will not call its `logError` internally. This means that errors occurring in the Vue renderer will not show up in the developer console.
If you want to preserve this functionality, make sure to pass the `logErrors: true` option.
</div>
</div>
