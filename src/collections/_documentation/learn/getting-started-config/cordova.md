You need to inform the sentry electron SDK about your CDN somewhere before
application startup:

```javascript
onDeviceReady: function() {
  var Sentry = cordova.require("sentry-cordova.Sentry");
  Sentry.init({ dsn: '___PUBLIC_DSN___' });
}
```
