---
name: Cordova
doc_link: https://docs.sentry.io/platforms/javascript/guides/cordova/
support_level: production
type: language
---

<!-- * * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * *
*                          UPDATES WILL NO LONGER BE REFLECTED IN SENTRY                            *
*                                                                                                   *
* We've successfully migrated all "getting started/wizard" documents to the main Sentry repository, *
* where you can find them in the folder named "gettingStartedDocs" ->                               *
* https://github.com/getsentry/sentry/tree/master/static/app/gettingStartedDocs.                    *
*                                                                                                   *
* Find more details about the project in the concluded Epic ->                                      *
* https://github.com/getsentry/sentry/issues/48144                                                  *
*                                                                                                   *
* This document is planned to be removed in the future. However, it has not been removed yet,       *
* primarily because self-hosted users depend on it to access instructions for setting up their      *
* platform. We need to come up with a solution before removing these docs.                          *
* * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * * * -->

Install our SDK using the cordova command:

```bash
cordova plugin add sentry-cordova
```

You should `init` the SDK in the `deviceReady` function, to make sure the native integrations runs. For more details about Cordova [click here](/platforms/javascript/guides/cordova/)

```javascript
onDeviceReady: function() {
  var Sentry = cordova.require('sentry-cordova.Sentry');
  Sentry.init({ dsn: '___PUBLIC_DSN___' });
}
```

One way to verify your setup is by intentionally causing an error that breaks your application.

Calling an undefined function will throw an exception:

```javascript
myUndefinedFunction();
```
