---
name: Ember
doc_link: https://docs.sentry.io/platforms/javascript/guides/ember/
support_level: production
type: framework
---

## Install

Sentry captures data by using an SDK within your application’s runtime.

```bash
# Using ember-cli
ember install @sentry/ember
```

## Configure

You should `init` the Sentry SDK as soon as possible during your application load up in `app.js`, before initializing Ember:

```javascript
import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

import * as Sentry from '@sentry/ember';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [new Sentry.Replay()],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}
```

## Verify

This snippet contains an intentional error and can be used as a test to make sure that everything's working as expected.

```javascript
myUndefinedFunction();
```

---

## Next Steps

- [Source Maps](https://docs.sentry.io/platforms/javascript/guides/ember/sourcemaps/): Learn how to enable readable stack traces in your Sentry errors.
- [Ember Features](https://docs.sentry.io/platforms/javascript/guides/ember/features/): Learn about our first class integration with the Ember framework.
- [Performance Monitoring](https://docs.sentry.io/platforms/javascript/guides/ember/performance/): Track down transactions to connect the dots between 10-second page loads and poor-performing API calls or slow database queries.
