The client provides a close method that optionally takes the time in milliseconds for how long it
waits and will return a promise that resolves when everything was flushed or the timeout kicked
in.

```javascript
const client = Sentry.getCurrentHub().getClient();
if (client) {
  client.close(2000).then(function() {
    process.exit();
  });
}
```
