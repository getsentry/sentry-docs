---
title: Koa
sidebar_order: 1011
---

<!-- WIZARD -->

Our Koa integration only requires the installation of `@sentry/node`, and then you can use it like this:

```javascript
import Koa from 'koa';
import * as Sentry from '@sentry/node';

// or using CommonJS
// const Koa = require('koa');
// const Sentry = require('@sentry/node');

const app = new Koa();

Sentry.init({ dsn: '___PUBLIC_DSN___' });

app.on('error', (err, ctx) => {
  Sentry.withScope(function(scope) {
    scope.addEventProcessor(function(event) {
      return Sentry.Handlers.parseRequest(event, ctx.request); 
    });
    Sentry.captureException(err);
  });
});

app.listen(3000);
```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->
