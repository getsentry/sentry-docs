---
title: Advanced Settings
sidebar_order: 30001
---

## BrowserClient

To be able to manage several Sentry instances without any conflicts between them you need to create your own `Client`.
This also helps to prevent tracking of any parent application errors in case if your application is integrated
inside of it.

```javascript
import { BrowserClient } from "@sentry/browser";

const client = new Sentry.BrowserClient({
  dsn: YOUR_DSN,
});

client.captureException(new Error('example'));
```
