---
title: Angular
sidebar_order: 35
---

<!-- WIZARD -->
This document uses Angular to refer to Angular 2+. On its own, `@sentry/browser` will report any uncaught exceptions triggered from your application.

Additionally, `@sentry/browser` can be configured to catch any Angular-specific (2.x) exceptions reported through the [@angular/core/ErrorHandler](https://angular.io/api/core/ErrorHandler) component.

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
    Sentry.captureException(error.originalError || error);
    throw error;
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
<!-- ENDWIZARD -->
