---
title: Koa
sidebar_order: 8
---

```javascript
var koa = require('koa');
var Raven = require('raven');

var app = koa();
Raven.config('___PUBLIC_DSN___').install();

app.on('error', function (err) {
    Raven.captureException(err, function (err, eventId) {
        console.log('Reported error ' + eventId);
    });
});

app.listen(3000);
```
