<!-- WIZARD -->
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
