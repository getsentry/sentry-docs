The `close` method optionally takes a timeout in milliseconds and returns a
promise that resolves when all pending events are flushed, or the timeout kicks
in.

```javascript
Sentry.close(2000).then(function() {
  process.exit();
});
```

After a call to `close`, the current client cannot be used anymore. It's
important to only call `close` immediately before shutting down the application.

Alternatively, the `flush` method drains the event queue while keeping the
client enabled for continued use.
