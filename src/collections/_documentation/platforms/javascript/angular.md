---
title: Angular
sidebar_order: 35
---

<!-- WIZARD -->
On its own, `@sentry/browser` will report any uncaught exceptions triggered from your application. Additionally, `@sentry/browser` can be configured to catch any Angular-specific (2.x) exceptions reported through the [@angular/core/ErrorHandler](https://angular.io/api/core/ErrorHandler) component. This is also a great opportunity to collect user feedback by using `Sentry.showReportDialog`.

First, install `@sentry/browser`:

```bash
# Using yarn
yarn add @sentry/browser

# Using npm
npm install @sentry/browser
```

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ErrorHandler, Injectable } from "@angular/core";

import { AppComponent } from "./app.component";

import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "___PUBLIC_DSN___"
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    const eventId = Sentry.captureException(error.originalError || error);
    Sentry.showReportDialog({ eventId });
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [{ provide: ErrorHandler, useClass: SentryErrorHandler }],
  bootstrap: [AppComponent]
})

export class AppModule {}
```

## AngularJS 1.x

If you're using `AngularJS 1.x`, you can use Sentry's AngularJS integration.

First, install `@sentry/browser` and `@sentry/integrations`:

```bash
# Using yarn
yarn add @sentry/browser @sentry/integrations

# Using npm
npm install @sentry/browser @sentry/integrations
```

```javascript
import angular from 'angular';
import * as Sentry from '@sentry/browser';
import { Angular as AngularIntegration } from '@sentry/integrations';

// Make sure to call Sentry.init after importing AngularJS. 
// You can also pass {angular: AngularInstance} to the Integrations.Angular() constructor.
Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [
    new AngularIntegration(),
  ],
});

// Finally require ngSentry as a dependency in your application module.
angular.module('yourApplicationModule', ['ngSentry']);

```

In case you're using the CDN version or the Loader, Sentry provides a standalone file for every integration:

```html
<!-- Note that we now also provide a es6 build only -->
<!-- <script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.es6.min.js" integrity="{% sdk_cdn_checksum sentry.javascript.browser latest bundle.es6.min.js %}" crossorigin="anonymous"></script> -->
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.min.js" integrity="{% sdk_cdn_checksum sentry.javascript.browser latest bundle.min.js %}" crossorigin="anonymous"></script>

<!-- If you include the integration it will be available under Sentry.Integrations.Angular -->
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/angular.min.js" crossorigin="anonymous"></script>

<script>
  Sentry.init({
    dsn: '___PUBLIC_DSN___',
    integrations: [
      new Sentry.Integrations.Angular(),
    ],
  });
</script>
```
<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->
