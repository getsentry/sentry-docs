---
title: Vue
sidebar_order: 40
---

<!-- WIZARD -->
To use Sentry with your Vue application, you will need to use Sentry’s browser JavaScript SDK: `@sentry/browser`.

```bash
# Using yarn
$ yarn add @sentry/browser

# Using npm
$ npm install @sentry/browser
```

On its own, `@sentry/browser` will report any uncaught exceptions triggered by your application.

Additionally, the Vue _integration_ will capture the name and props state of the active component where the error was thrown. This is reported via Vue’s `config.errorHandler` hook.

Starting with version `5.x` our `Vue` integration lives in its own package `@sentry/integrations`.
You can install it with `npm` / `yarn`:

```bash
# Using yarn
yarn add @sentry/integrations

# Using npm
npm install @sentry/integrations
```

Passing in `Vue` is optional, if you do not pass it `window.Vue` must be present.

Passing in `attachProps` is optional and is `true` if it is not provided. If you set it to `false`, Sentry will suppress sending all Vue components' props for logging.

{% capture __alert %}
Please note that if you enable this integration Vue internally will not call `logError` due to a currently know limitation see: [GitHub Issue](https://github.com/vuejs/vue/issues/8433). This means that errors occurring in the Vue renderer will not show up in the developer console.
{% endcapture %}

{% include components/alert.html
  title="Vue Error Handling"
  content=__alert
  level="warning"
%}

```javascript
import Vue from 'vue'
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [new Integrations.Vue({Vue, attachProps: true})],
});
```

In case you are using the CDN version or the Loader, we provide a standalone file for every integration, you can use it
like this:

```html
<!-- Note that we now also provide a es6 build only -->
<!-- <script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.es6.min.js" crossorigin="anonymous"></script> -->
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.min.js" crossorigin="anonymous"></script>

<!-- If you include the integration it will be available under Sentry.Integrations.Vue -->
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/vue.min.js" crossorigin="anonymous"></script>

<script>
  Sentry.init({
    dsn: '___PUBLIC_DSN___',
    integrations: [new Sentry.Integrations.Vue({Vue, attachProps: true})],
  });
</script>
```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->
