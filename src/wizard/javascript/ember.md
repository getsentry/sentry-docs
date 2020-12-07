---
name: Ember
doc_link: https://docs.sentry.io/platforms/javascript/guides/ember/
support_level: production
type: framework
---

To use Sentry with your Ember application, you will need to use Sentry’s Ember addon: `@sentry/ember`.

```bash
# Using ember-cli
ember install @sentry/ember
```

You should `init` the Sentry SDK as soon as possible during your application load up in `app.js`, before initializing Ember:

```javascript
import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

import { InitSentryForEmber } from '@sentry/ember';

InitSentryForEmber();

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}
```

Then add the following config to your `config/environment.js`:

```javascript
ENV['@sentry/ember'] = {
  sentry: {
    dsn: '___PUBLIC_DSN___',
    autoSessionTracking: true,
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  }
};
```

The above configuration captures both error and performance data. To reduce the volume of performance data captured, change `tracesSampleRate` to a value between 0 and 1.
