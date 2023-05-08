---
name: Vue
doc_link: https://docs.sentry.io/platforms/javascript/guides/vue/
support_level: production
type: framework
---

## Install

Sentry captures data by using an SDK within your application’s runtime.

```bash
# Using yarn
yarn add @sentry/vue

# Using npm
npm install --save @sentry/vue
```

## Configure

Initialize Sentry as early as possible in your application's lifecycle.

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
  integrations: [new Sentry.Replay()],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
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
  integrations: [new Sentry.Replay()],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

app.use(router);
app.mount("#app");
```

## Verify

This snippet contains an intentional error and can be used as a test to make sure that everything's working as expected.

```javascript
myUndefinedFunction();
```

---

## Next Steps

- [Source Maps](https://docs.sentry.io/platforms/javascript/guides/vue/sourcemaps/): Learn how to enable readable stack traces in your Sentry errors.
- [Vue Features](https://docs.sentry.io/platforms/javascript/guides/vue/features/): Learn about our first class integration with the Vue framework.
- [Performance Monitoring](https://docs.sentry.io/platforms/javascript/guides/vue/performance/): Track down transactions to connect the dots between 10-second page loads and poor-performing API calls or slow database queries.
