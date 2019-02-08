---
title: Ember
sidebar_order: 50
---
<!-- WIZARD -->
To use Sentry with your Ember application, you will need to use `@sentry/browser` (Sentry’s browser JavaScript SDK).  
On its own, `@sentry/browser` will report any uncaught exceptions triggered from your application.
In order to use ESM imports without any additional configuration, you can use `ember-auto-import`
by installing it with `ember install ember-auto-import`.

Then add this to your `app.js`:

```javascript
import * as Sentry from '@sentry/browser'

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [new Sentry.Integrations.Ember()]
});
```
<!-- ENDWIZARD -->
