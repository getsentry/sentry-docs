```javascript
onDeviceReady: function() {
  var Sentry = cordova.require("sentry-cordova.Sentry");
  Sentry.init({
    release: "{{ page.release_identifier }}"
  });
}
```
