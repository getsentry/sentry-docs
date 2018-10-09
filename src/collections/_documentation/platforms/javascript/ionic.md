---
title: Ionic
sidebar_order: 201
---

To use Sentry with [Ionic](https://ionicframework.com/) you have to add _sentry-cordova_ as a dependency to you package.json.

First run `npm i --save sentry-cordova` and make sure you already added the the platfroms you want to support with `ionic cordova platform add ios` and/or `ionic cordova platform add android`.

After that it’s important to run `cordova plugin add sentry-cordova` without the ionic wrapper.

{% capture __alert_content -%}
Do not run `ionic cordova plugin add sentry-cordova`. The ionic cli wrapper sucks up all the input and sentry-wizard will not be able to setup your project.
{%- endcapture -%}
{%- include components/alert.html
  level="warning"
  title="Warning"
  content=__alert_content
%}

When building your app with ionic for production make sure you have sourcemaps enabled. You have to add this to your `package.json`:

```javascript
"config": {
    "ionic_generate_source_map": "true"
}
```

Otherwise we are not able to upload sourcemaps to Sentry.

{% capture __alert_content -%}
If you want to skip the automatic release version and set the release completly for yourself. You have to add this env var to disable it e.g.: `SENTRY_SKIP_AUTO_RELEASE=true ionic cordova emulate ios --prod`
{%- endcapture -%}
{%- include components/alert.html
  level="warning"
  title="Warning"
  content=__alert_content
%}

To setup Sentry in your codebase, add this to your `app.module.ts`:

```javascript
import * as Sentry from 'sentry-cordova';

Sentry.init({ dsn: '___PUBLIC_DSN___' });
```

In order to also use the Ionic provided `IonicErrorHandler`, we need to add `SentryIonicErrorHandler`:

```javascript
import { IonicErrorHandler } from 'ionic-angular';

import * as Sentry from 'sentry-cordova';

class SentryIonicErrorHandler extends IonicErrorHandler {
  handleError(error) {
    super.handleError(error);
    try {
      Sentry.captureException(error.originalError || error);
    } catch (e) {
      console.error(e);
    }
  }
}
```

Then change the `@NgModule{providers:[]}` in `app.module.ts` to:

```javascript
@NgModule({
    ...
    providers: [
        StatusBar,
        SplashScreen,
        // {provide: ErrorHandler, useClass: IonicErrorHandler} remove this, add next line
        {provide: ErrorHandler, useClass: SentryIonicErrorHandler}
    ]
})
```
