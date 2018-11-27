---
title: Vue
sidebar_order: 40
---

<!-- WIZARD -->

To use Sentry with your Vue application, you will need to use `@sentry/browser` (Sentry’s browser JavaScript SDK).  
On its own, `@sentry/browser` will report any uncaught exceptions triggered from your application.

Additionally, the Vue _integration_ will capture the name and props state of the active component where the error was thrown. This is reported via Vue’s `config.errorHandler` hook.

Passing in `Vue` is optional, if you do not pass it `window.Vue` has to be present.

```javascript
import * as Sentry from '@sentry/browser'

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [new Sentry.Integrations.Vue({ Vue })]
})
```

<!-- ENDWIZARD -->
