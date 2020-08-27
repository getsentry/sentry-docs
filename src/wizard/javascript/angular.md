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
$ yarn add @sentry/angular

# Using npm
$ npm install @sentry/angular
```

You should `init` the Sentry browser SDK as soon as possible during your application load up, before initializing Angular:

```javascript
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular';

import { AppModule } from './app/app.module';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
});

enableProdMode();
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(success => console.log(`Bootstrap success`))
  .catch(err => console.error(err));
```

On its own, `@sentry/angular` will report any uncaught exceptions triggered by your application. Additionally, you can configure `@sentry/angular` to catch any Angular-specific exceptions reported through the [@angular/core/ErrorHandler](https://angular.io/api/core/ErrorHandler) provider.

### ErrorHandler

`@sentry/angular` exports a function to instantiate `ErrorHandler` provider that will automatically send JavaScript errors captured by the Angular's error handler.

```javascript
import { NgModule, ErrorHandler } from '@angular/core';
import * as Sentry from '@sentry/angular';

@NgModule({
  // ...
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: true,
      }),
    },
  ],
  // ...
})
export class AppModule {}
```

Additionally, `createErrorHandler` accepts a set of options that allows you to configure its behaviour. For more details see `ErrorHandlerOptions` interface in [our repository](https://github.com/getsentry/sentry-javascript/blob/master/packages/angular/src/errorhandler.ts).


<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
