Options are passed to the `init()` as object in the `onDeviceReady` function:

```javascript
onDeviceReady: function() {
  var Sentry = cordova.require("sentry-cordova.Sentry");
  Sentry.init({
    dsn: '___PUBLIC_DSN___',
    maxBreadcrumbs: 50,
    debug: true,
  });
}
```
