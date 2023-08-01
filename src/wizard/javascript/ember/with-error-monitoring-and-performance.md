---
name: Ember
doc_link: https://docs.sentry.io/platforms/javascript/guides/ember/
support_level: production
type: framework
---

<!-- * * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * *
*                          UPDATES WILL NO LONGER BE REFLECTED IN SENTRY                            *
*                                                                                                   *
* We've successfully migrated all "getting started/wizard" documents to the main Sentry repository, *
* where you can find them in the folder named "gettingStartedDocs" ->                               *
* https://github.com/getsentry/sentry/tree/master/static/app/gettingStartedDocs.                    *
*                                                                                                   *
* Find more details about the project in the concluded Epic ->                                      *
* https://github.com/getsentry/sentry/issues/48144                                                  *
*                                                                                                   *
* This document is planned to be removed in the future. However, it has not been removed yet,       *
* primarily because self-hosted users depend on it to access instructions for setting up their      *
* platform. We need to come up with a solution before removing these docs.                          *
* * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * * * -->

## Install

Sentry captures data by using an SDK within your application’s runtime.

```bash
# Using ember-cli
ember install @sentry/ember
```

## Configure

You should `init` the Sentry SDK as soon as possible during your application load up in `app.js`, before initializing Ember:

```javascript
import Application from "@ember/application";
import Resolver from "ember-resolver";
import loadInitializers from "ember-load-initializers";
import config from "./config/environment";

import * as Sentry from "@sentry/ember";

Sentry.init({
  dsn: "___PUBLIC_DSN___",

  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
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
- [Session Replay](https://docs.sentry.io/platforms/javascript/guides/ember/session-replay/): Get to the root cause of an error or latency issue faster by seeing all the technical details related to that issue in one visual replay on your web application.
