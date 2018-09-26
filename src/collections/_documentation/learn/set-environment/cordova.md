```javascript
onDeviceReady: function() {
    var Sentry = cordova.require("sentry-cordova.Sentry");
    Sentry.init({
        environment: '{{ page.example_environment }}',
    });
}
```
