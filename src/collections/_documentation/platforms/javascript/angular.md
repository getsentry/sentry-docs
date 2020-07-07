---
title: Angular
sidebar_order: 35
---

<!-- WIZARD -->
On its own, `@sentry/browser` will report any uncaught exceptions triggered from your application. Additionally, you can configure `@sentry/browser` to catch any Angular-specific exceptions reported through the [@angular/core/ErrorHandler](https://angular.io/api/core/ErrorHandler) component. This is also a great opportunity to collect user feedback by using `Sentry.showReportDialog`.

First, install `@sentry/browser`:

```bash
# Using yarn
yarn add @sentry/browser

# Using npm
npm install @sentry/browser
```

Then initialize a new Sentry instance and configure Angular with the `ErrorHandler` provided and explained below:

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ErrorHandler, Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";

import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";

import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  // TryCatch has to be configured to disable XMLHttpRequest wrapping, as we are going to handle
  // http module exceptions manually in Angular's ErrorHandler and we don't want it to capture the same error twice.
  // Please note that TryCatch configuration requires at least @sentry/browser v5.16.0.
  integrations: [new Sentry.Integrations.TryCatch({
    XMLHttpRequest: false,
  })],
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}

  extractError(error) {
    // Try to unwrap zone.js error.
    // https://github.com/angular/angular/blob/master/packages/core/src/util/errors.ts
    if (error && error.ngOriginalError) {
      error = error.ngOriginalError;
    }

    // We can handle messages and Error objects directly.
    if (typeof error === "string" || error instanceof Error) {
      return error;
    }

    // If it's http module error, extract as much information from it as we can.
    if (error instanceof HttpErrorResponse) {
      // The `error` property of http exception can be either an `Error` object, which we can use directly...
      if (error.error instanceof Error) {
        return error.error;
      }

      // ... or an`ErrorEvent`, which can provide us with the message but no stack...
      if (error.error instanceof ErrorEvent) {
        return error.error.message;
      }

      // ...or the request body itself, which we can use as a message instead.
      if (typeof error.error === "string") {
        return `Server returned code ${error.status} with body "${error.error}"`;
      }

      // If we don't have any detailed information, fallback to the request message itself.
      return error.message;
    }

    // Skip if there's no error, and let user decide what to do with it.
    return null;
  }

  handleError(error) {
    const extractedError = this.extractError(error) || "Handled unknown error";

    // Capture handled exception and send it to Sentry.
    const eventId = Sentry.captureException(extractedError);
    
    // When in development mode, log the error to console for immediate feedback.
    if (!environment.production) {
      console.error(extractedError);
    }
    
    // Optionally show user dialog to provide details on what happened.
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

When using your own `ErrorHandler`, make sure that whenever you use `HttpInterceptor` alongside it,
the interceptor doesn't modify the error captured originally.
The same goes for writing your own API services with built-in `http` methods.

For example, the service below makes it impossible for the SDK to extract the correct data, because the full, original error `e` is not propagated.

```js
export class ApiService {
  constructor(http) {
    this.http = http;
  }

  formatErrors(e) {
    console.log('Captured service error');
    return throwError(e.error);
  }

  get(path) {
    return this.http
      .get(path)
      .pipe(catchError(this.formatErrors));
  }
}
```

Instead, make sure that you always rethrow or directly pass the original error. For example:

```js
export class ApiService {
  constructor(http) {
    this.http = http;
  }
  
  get(path) {
    return this.http
      .get(path)
      .pipe(catchError((e) => throwError(e)));
  }
}
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
