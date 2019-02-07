---
title: Koa
sidebar_order: 8
---

<!-- WIZARD -->
```javascript
var Koa = require('koa');
var Sentry = require('@sentry/node');

// var app = koa(); // koa@1.x
var app = new Koa(); // koa@2.x+ (current)
Sentry.init({ dns: process.env.SENTRY_DSN });

app.on('error', function (err) {
    Sentry.captureException(err, function (err, eventId) {
        console.log('Reported error ' + eventId);
    });
});

app.listen(3000);
```
<!-- ENDWIZARD -->
