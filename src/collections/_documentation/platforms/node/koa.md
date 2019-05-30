---
title: Koa
sidebar_order: 1011
---

<!-- WIZARD -->

Our Koa integration only requires the installation of `@sentry/node`, and then you can use it like this:

```javascript
const koa = require('koa');
const app = koa();
const Sentry = require('@sentry/node');

Sentry.init({ dsn: '___PUBLIC_DSN___' });

app.on('error', (err, ctx) => {
  Sentry.withScope(scope => {
    scope.addEventProcessor(event => Sentry.Handlers.parseRequest(event, ctx.request));
    Sentry.captureException(err);
  });
});

app.listen(3000);
```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->
