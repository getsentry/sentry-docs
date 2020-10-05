---
name: Koa
doc_link: https://docs.sentry.io/platforms/node/guides/koa/
support_level: production
type: framework
---

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
  Sentry.withScope(function(scope) {
    scope.addEventProcessor(function(event) {
      return Sentry.Handlers.parseRequest(event, ctx.request);
    });
    Sentry.captureException(err);
  });
});

app.listen(3000);
```
