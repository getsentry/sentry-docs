
**Vue.js**

To get started with performance monitoring with Vue.js, first install these packages:

```bash
# Using yarn
$ yarn add @sentry/browser @sentry/integrations @sentry/apm

# Using npm
$ npm install @sentry/browser @sentry/integrations @sentry/apm
```

The Vue Tracing Integration allows you to track rendering performance during an initial application load.

Sentry injects a handler inside Vue's `beforeCreate` mixin, providing access to a Vue component during its life cycle stages.
When Sentry encounters a component named `root`, which is a top-level Vue instance (as in `new Vue({})`), we use our AM Tracing integration,
and create a new activity named `Vue Application Render`. Once the activity has been created, it will wait until all of its child components render, and there aren't new rendering events triggered within the configured `timeout`, before marking the activity as completed.

The described instrumentation functionality will give you very high-level information about the rendering performance of the Vue instance. However, the integration can also provide more fine-grained details about what actually happened during a specific activity.
To do that, you need to specify which components to track and what hooks to listen to (you can find a list of all available hooks [here](https://vuejs.org/v2/api/#Options-Lifecycle-Hooks)). You can also turn on tracking for all the components. However, it may be rather noisy if your app consists of hundreds of components. We encourage being more specific. If you don't provide hooks, Sentry will track a component's `mount` and `update` hooks.

Note that we don't use `before` and `-ed` pairs for hooks, and you should provide a simple verb instead. For example, `update` is correct. `beforeUpdate` and `updated` are incorrect.

To set up the Vue Tracing Integration, you will first need to configure the AM Tracing integration itself. For details on how to do this, see the [JavaScript](/performance-monitoring/distributed-tracing/#javascript) section above.
Once you've configured the Tracing integration, move on to configuring the Vue integration itself.
Sentry built the new tracing capabilities into the original Vue error handler integrations, so there is no need to add any new packages. You only need to provide an appropriate configuration.

The most basic configuration for tracing your Vue app, which would track only the top-level component, looks like this:

```js
import * as Sentry from "@sentry/browser";
import { Vue as VueIntegration } from "@sentry/integrations";
import { Integrations } from "@sentry/apm";
import Vue from "vue";

Sentry.init({
  // ...
  integrations: [
    new Integrations.Tracing(),
    new VueIntegration({
      Vue,
      tracing: true
    })
  ],
  tracesSampleRate: 1
});
```

If you want to track child components, and see more details about the rendering process, configure the integration to track them all:

```js
new VueIntegration({
  Vue,
  tracing: true,
  tracingOptions: {
    trackComponents: true
  }
})
```

Or, you can choose more granularity:

```js
new VueIntegration({
  Vue,
  tracing: true,
  tracingOptions: {
    trackComponents: ["App", "RwvHeader", "RwvFooter", "RwvArticleList", "Pagination"]
  }
})
```

If you want to know if some components are, for example, removed during the initial page load, add a `destroy` hook to the default:

```js
new VueIntegration({
  Vue,
  tracing: true,
  tracingOptions: {
    trackComponents: ["App", "RwvHeader", "RwvFooter", "RwvArticleList", "Pagination"],
    hooks: ['mount', 'update', 'destroy']
  }
})
```

You can specify how long a top-level activity should wait for the last component to render.
Every new rendering cycle is debouncing the timeout, and it starts counting from the beginning. Once the timeout is reached, tracking is completed, and all the information is sent to Sentry.

```js
new VueIntegration({
  Vue,
  tracing: true,
  tracingOptions: {
    trackComponents: true,
    timeout: 4000
  }
})
```

**Configuration**

```js
/**
 * When set to `true`, enables tracking of components lifecycle performance.
 * Default: false
 */
tracing: boolean;
tracingOptions: {
  /**
   * Decides whether to track components by hooking into its lifecycle methods.
   * Can be either set to `boolean` to enable/disable tracking for all of them.
   * Or to an array of specific component names (case-sensitive).
   * Default: false
   */
  trackComponents: boolean | string[];
  /**
   * How long to wait (in ms) until the tracked root activity is marked as finished and sent to Sentry
   * Default: 2000
   */
  timeout: number;
  /**
   * List of hooks to keep track of during component lifecycle.
   * Available hooks: 'activate' | 'create' | 'destroy' | 'mount' | 'update'
   * Based on https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
   */
  hooks: string[];
}
```
