---
name: Vue
doc_link: https://docs.sentry.io/platforms/javascript/guides/vue/
support_level: production
type: framework
---

## Instrument your application

To begin collecting error and performance data from your Vue application, you'll need the following packages:

- `@sentry/vue` (Sentry's Vue SDK)
- `@sentry/tracing` (instruments performance data)

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

#### Vue 2

```javascript
import Vue from "vue";
import Router from "vue-router";
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

Vue.use(Router);

const router = new Router({
  // ...
});

Sentry.init({
  Vue,
  dsn: "___PUBLIC_DSN___",
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracePropagationTargets: ["localhost", "my-site-url.com", /^\//],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// ...

new Vue({
  router,
  render: h => h(App),
}).$mount("#app");
```

#### Vue 3

```javascript
import { createApp } from "vue";
import { createRouter } from "vue-router";
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

const app = createApp({
  // ...
});
const router = createRouter({
  // ...
});

Sentry.init({
  app,
  dsn: "___PUBLIC_DSN___",
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracePropagationTargets: ["localhost", "my-site-url.com", /^\//],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

app.use(router);
app.mount("#app");
```

We recommend adjusting the value of `tracesSampleRate` in production. Learn more about configuring sampling in our [full documentation](https://docs.sentry.io/platforms/javascript/configuration/sampling/).

<div class="alert alert-warning" role="alert"><h5 class="no_toc">Vue Error Handling</h5><div class="alert-body content-flush-bottom">
Please note that if you enable this integration, by default Vue will not call its `logError` internally.
This means that errors occurring in the Vue renderer will not show up in the developer console.
If you want to preserve this functionality, make sure to pass the `logErrors: true` option.
</div>
</div>
