---
title: Ember
sidebar_order: 50
---
<!-- WIZARD -->
To use Sentry with your Ember application, you will need to use Sentry’s browser JavaScript SDK: `@sentry/browser`.

On its own, `@sentry/browser` will report any uncaught exceptions triggered from your application.
In order to use ESM imports without any additional configuration, you can use `ember-auto-import`
by installing it with `ember install ember-auto-import`.

Starting with version `5.x` our `Ember` integration lives in it's own package `@sentry/integrations`.
You can install it with `npm` / `yarn` like:

```bash
# Using yarn
yarn add @sentry/integrations

# Using npm
npm install @sentry/integrations
```

Then add this to your `app.js`:

```javascript
import * as Sentry from '@sentry/browser'
import { Ember as EmberIntegration } from '@sentry/integrations';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [new EmberIntegration()]
});
```

In case you are using the CDN version or the Loader, we provide a standalone file for every integration, you can use it
like this:

```html
<!-- Note that we now also provide a es6 build only -->
<!-- <script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.es6.min.js" integrity="{% sdk_cdn_checksum sentry.javascript.browser latest bundle.es6.min.js %}" crossorigin="anonymous"></script> -->
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.min.js" integrity="{% sdk_cdn_checksum sentry.javascript.browser latest bundle.min.js %}" crossorigin="anonymous"></script>

<!-- If you include the integration it will be available under Sentry.Integrations.Ember -->
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/ember.min.js" crossorigin="anonymous"></script>

<script>
  Sentry.init({
    dsn: '___PUBLIC_DSN___',
    integrations: [
      new Sentry.Integrations.Ember(),
    ],
  });
</script>
```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->
