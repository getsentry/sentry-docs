---
name: Angular
doc_link: https://docs.sentry.io/platforms/javascript/guides/angular/
support_level: production
type: framework
---

To use Sentry with your Angular application, you will need to use `@sentry/angular` (Sentry’s Browser Angular SDK).

Add the Sentry SDK as a dependency using `yarn` or `npm`:

```bash
# Using yarn
yarn add @sentry/angular @sentry/tracing

# Using npm
npm install --save @sentry/angular @sentry/tracing
```

You should `init` the Sentry browser SDK as soon as possible during your application load up, before initializing Angular:

```javascript
import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import * as Sentry from "@sentry/angular";
import { Integrations } from "@sentry/tracing";

import { AppModule } from "./app/app.module";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ["localhost", "https://yourserver.io/api"],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

enableProdMode();
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(success => console.log(`Bootstrap success`))
  .catch(err => console.error(err));
```

The above configuration captures both error and performance data. To reduce the volume of performance data captured, change `tracesSampleRate` to a value between 0 and 1.

On its own, `@sentry/angular` will report any uncaught exceptions triggered by your application. Additionally, you can configure `@sentry/angular` to catch any Angular-specific exceptions reported through the [@angular/core/ErrorHandler](https://angular.io/api/core/ErrorHandler) provider.

### ErrorHandler and Tracer

`@sentry/angular` exports a function to instantiate `ErrorHandler` provider that will automatically send JavaScript errors captured by the Angular's error handler.

```javascript
import { APP_INITIALIZER, ErrorHandler, NgModule } from "@angular/core";
import { Router } from "@angular/router";
import * as Sentry from "@sentry/angular";

@NgModule({
  // ...
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: true,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
  ],
  // ...
})
export class AppModule {}
```

Additionally, `createErrorHandler` accepts a set of options that allows you to configure its behavior. For more details see `ErrorHandlerOptions` interface in [our repository](https://github.com/getsentry/sentry-javascript/blob/master/packages/angular/src/errorhandler.ts).

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
