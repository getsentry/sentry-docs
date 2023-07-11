---
name: Angular
doc_link: https://docs.sentry.io/platforms/javascript/guides/angular/
support_level: production
type: framework
---

To use Sentry with your Angular application, you'll need `@sentry/angular-ivy` or `@sentry/angular`, Sentry’s Browser Angular SDKs:

- If you're using Angular 12 or newer, use `@sentry/angular-ivy`
- If you're using Angular 10 or 11, use `@sentry/angular`

Add the Sentry SDK as a dependency using `yarn` or `npm`:

```bash
# Using yarn (Angular 12+)
yarn add @sentry/angular-ivy
# Using yarn (Angular 10 and 11)
yarn add @sentry/angular

# Using npm (Angular 12+)
npm install --save @sentry/angular-ivy
# Using npm (Angular 10 and 11)
npm install --save @sentry/angular
```

You should `init` the Sentry browser SDK in your `main.ts` file as soon as possible during application load up, before initializing Angular:

```javascript
import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
// import * as Sentry from "@sentry/angular" // for Angular 10/11 instead
import * as Sentry from "@sentry/angular-ivy";

import { AppModule } from "./app/app.module";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
});

enableProdMode();
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((success) => console.log(`Bootstrap success`))
  .catch((err) => console.error(err));
```

The above configuration captures both error and performance data. To reduce the volume of performance data captured, change `tracesSampleRate` to a value between 0 and 1.

On its own, the Angular SDK will report any uncaught exceptions triggered by your application. Additionally, you can configure the SDK to catch any Angular-specific exceptions reported through the [@angular/core/ErrorHandler](https://angular.io/api/core/ErrorHandler) provider.

### ErrorHandler and Tracer

The Sentry Angular SDK exports a function to instantiate `ErrorHandler` provider that will automatically send JavaScript errors captured by the Angular's error handler.

```javascript
import { APP_INITIALIZER, ErrorHandler, NgModule } from "@angular/core";
import { Router } from "@angular/router";
// import * as Sentry from "@sentry/angular" // for Angular 10/11 instead
import * as Sentry from "@sentry/angular-ivy";

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
