You should `init` the SDK in the `deviceReady` function, to make sure the native integrations run. For more information, see [full documentation on Cordova](/platforms/javascript/cordova/).  

```javascript
onDeviceReady: function() {
  var Sentry = cordova.require("sentry-cordova.Sentry");
  Sentry.init({ dsn: '___PUBLIC_DSN___' });
}
```
