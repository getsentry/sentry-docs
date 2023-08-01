---
name: Angular
doc_link: https://docs.sentry.io/platforms/javascript/guides/angular/
support_level: production
type: framework
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

## Install

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

## Configure

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
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
});

enableProdMode();
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((success) => console.log(`Bootstrap success`))
  .catch((err) => console.error(err));
```

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

## Verify

This snippet contains an intentional error and can be used as a test to make sure that everything's working as expected.

```javascript
myUndefinedFunction();
```

---

## Next Steps

- [Source Maps](https://docs.sentry.io/platforms/javascript/guides/angular/sourcemaps/): Learn how to enable readable stack traces in your Sentry errors.
- [Angular Features](https://docs.sentry.io/platforms/javascript/guides/angular/features/): Learn about our first class integration with the Angular framework.
- [Session Replay](https://docs.sentry.io/platforms/javascript/guides/angular/session-replay/): Get to the root cause of an error or latency issue faster by seeing all the technical details related to that issue in one visual replay on your web application.
