---
name: Koa
doc_link: https://docs.sentry.io/platforms/node/guides/koa/
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

Add `@sentry/node` as a dependency:

```bash
# Using yarn
yarn add @sentry/node

# Using npm
npm install --save @sentry/node
```

Initialize the Sentry SDK and install the on error hook:

```javascript
import Koa from "koa";
import * as Sentry from "@sentry/node";

// or using CommonJS
// const Koa = require('koa');
// const Sentry = require('@sentry/node');

const app = new Koa();

Sentry.init({ dsn: "___PUBLIC_DSN___" });

app.on("error", (err, ctx) => {
  Sentry.withScope(function (scope) {
    scope.addEventProcessor(function (event) {
      return Sentry.addRequestDataToEvent(event, ctx.request);
    });
    Sentry.captureException(err);
  });
});

app.listen(3000);
```
