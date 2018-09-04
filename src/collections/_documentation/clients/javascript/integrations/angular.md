---
title: Angular
sidebar_order: 7
---

This document uses Angular to refer to Angular 2+. On its own, Raven.js will report any uncaught exceptions triggered from your application. For advanced usage examples of Raven.js, please read [_Raven.js usage_]({%- link _documentation/clients/javascript/usage.md -%}).

Additionally, Raven.js can be configured to catch any Angular-specific (2.x) exceptions reported through the [@angular/core/ErrorHandler](https://angular.io/api/core/ErrorHandler) component.

## TypeScript Support

Raven.js ships with a [TypeScript declaration file](https://github.com/getsentry/raven-js/blob/master/packages/raven-js/typescript/raven.d.ts), which helps static checking correctness of Raven.js API calls, and facilitates auto-complete in TypeScript-aware IDEs like Visual Studio Code.

## Installation

Raven.js should be installed via npm.

```sh
$ npm install raven-js --save
```

## Configuration

Configuration depends on which module loader/packager you are using to build your Angular application.

Below are instructions for [SystemJS](https://github.com/systemjs/systemjs), followed by instructions for [Webpack](https://webpack.github.io/), Angular CLI, and other module loaders/packagers.

### SystemJS

First, configure SystemJS to locate the Raven.js package:

```js
System.config({
  packages: {
    /* ... existing packages above ... */
    'raven-js': {
      main: 'dist/raven.js'
    }
  },
  paths: {
    /* ... existing paths above ... */
    'raven-js': 'node_modules/raven-js'
  }
});
```

Then, in your main module file (where `@NgModule` is called, e.g. app.module.ts):

```js
import Raven = require('raven-js');
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

Raven
  .config('___PUBLIC_DSN___')
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err:any) : void {
    Raven.captureException(err.originalError || err);
    if(!environment.production) {
      super.handleError(err);
    }
  }
}

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ],
  providers: [ { provide: ErrorHandler, useClass: RavenErrorHandler } ]
})
export class AppModule { }
```

Once you’ve completed these two steps, you are done.

### Angular CLI

Angular CLI now uses Webpack to build instead of SystemJS. All you need to do is modify your main module file (where `@NgModule` is called, e.g. app.module.ts):

```js
import * as Raven from 'raven-js';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppComponent } from './app.component';

Raven
  .config('___PUBLIC_DSN___')
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err:any) : void {
    Raven.captureException(err);
  }
}

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ],
  providers: [ { provide: ErrorHandler, useClass: RavenErrorHandler } ]
})
export class AppModule { }
```

Once you’ve completed that step, you are done.
