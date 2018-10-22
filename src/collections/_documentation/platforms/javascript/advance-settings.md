---
title: Advanced Usage
sidebar_order: 30001
---

## Using a Client directly

To be able to manage several Sentry instances without any conflicts between them you need to create your own `Client`.
This also helps to prevent tracking of any parent application errors in case your application is integrated
inside of it. In this example we use `@sentry/browser` but it's also applicable to `@sentry/node`.

```javascript
import { BrowserClient } from "@sentry/browser";

const client = new BrowserClient({
  dsn: '___PUBLIC_DSN___',
});

client.captureException(new Error('example'));
```

While the above sample should work perfectly fine, some methods like `configureScope` and `withScope` are missing on the `Client` because the `Hub` takes care of the state management. That's why it may be easier to create a new `Hub` and bind your `Client` to it. The result is the same but you will also get state management with it.

```javascript
import { BrowserClient, Hub } from "@sentry/browser";

const client = new BrowserClient({
  dsn: '___PUBLIC_DSN___',
});

const hub = new Hub(client);

hub.configureScope(scope => {
  scope.setTag("a", "b");
});

hub.addBreadcrumb({ message: "crumb 1" });
hub.captureMessage("test");

try {
  a = b;
} catch (e) {
  hub.captureException(e);
}

hub.withScope(scope => {
  hub.addBreadcrumb({ message: "crumb 2" });
  hub.captureMessage("test2");
});
```
