---
title: Loopback
sidebar_order: 9
---

If you’re using Loopback 2.x LTS, make sure you’ve migrated to [strong-error-handler](https://loopback.io/doc/en/lb2/Using-strong-error-handler.html), otherwise no errors will get to `raven-node`.

Configure `raven-node` as early as possible:

```javascript
// server/server.js

const Raven = require('raven');
Raven.config('__DSN__').install();
```

Add `Raven.errorHandler` as a Loopback middleware:

```json
// server/middleware.json

"final:after": {
  "raven#errorHandler": {},
  "strong-error-handler": {
    "debug": false,
    "log": false
  }
}
```

You’re all set!
