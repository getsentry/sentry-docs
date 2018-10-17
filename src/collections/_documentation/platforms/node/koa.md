---
title: Koa
sidebar_order: 1011
---

<!-- WIZARD -->

Our Koa integration only requires _@sentry/node_ to be installed then you can use it like this:

```javascript
const koa = require('koa');
const app = koa();
const Sentry = require('@sentry/node');

Sentry.init({ dsn: '___PUBLIC_DSN___' });

app.on('error', err => {
  Sentry.captureException(err);
});

app.listen(3000);
```

<!-- ENDWIZARD -->
