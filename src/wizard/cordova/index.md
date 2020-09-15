---
name: Cordova
doc_link: https://docs.sentry.io/error-reporting/quickstart/?platform=cordova
support_level: production
type: language
---

Install our SDK using the cordova command:

```bash
$ cordova plugin add sentry-cordova@0.12.3
```

You should `init` the SDK in the `deviceReady` function, to make sure the native integrations runs. For more details about Cordova [click here](/platforms/javascript/cordova/)

```javascript
onDeviceReady: function() {
  var Sentry = cordova.require("sentry-cordova.Sentry");
  Sentry.init({ dsn: '___PUBLIC_DSN___' });
}
```

One way to verify your setup is by intentionally causing an error that breaks your application.

Calling an undefined function will throw an exception:

```js
myUndefinedFunction();
```
