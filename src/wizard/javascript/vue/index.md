---
name: Vue
doc_link: https://docs.sentry.io/platforms/javascript/guides/vue/
support_level: production
type: framework
---

## Instrument your application

To begin collecting error and performance data from your Vue application, you'll need to install the `@sentry/vue` package (Sentry's Vue SDK).

### Using yarn or npm

Install the dependencies:

```bash
# Using yarn
yarn add @sentry/vue

# Using npm
npm install --save @sentry/vue
```

Next, initialize Sentry in your app entry point before you initialize your root component.

#### Vue 2

```javascript
import Vue from "vue";
import Router from "vue-router";
import * as Sentry from "@sentry/vue";

Vue.use(Router);

const router = new Router({
  // ...
});

Sentry.init({
  Vue,
  dsn: "___PUBLIC_DSN___",
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
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
  render: (h) => h(App),
}).$mount("#app");
```

#### Vue 3

```javascript
import { createApp } from "vue";
import { createRouter } from "vue-router";
import * as Sentry from "@sentry/vue";

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
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
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
