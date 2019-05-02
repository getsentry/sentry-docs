---
title: Integrations
---

Integrations extend the functionality of Raven.js to cover common libraries and environments automatically using simple plugins.

## What are plugins? {#what-are-plugins}

In Raven.js, plugins are little snippets of code to augment functionality for a specific application/framework. It is highly recommended to checkout the list of plugins and use what apply to your project.

In order to keep the core small, we have opted to only include the most basic functionality by default, and you can pick and choose which plugins are applicable for you.

## Why are plugins needed at all? {#why-are-plugins-needed-at-all}

JavaScript is pretty restrictive when it comes to exception handling, and there are a lot of things that make it difficult to get relevent information, so it’s important that we inject code and wrap things magically so we can extract what we need. See [_Usage_]({%- link _documentation/clients/javascript/usage.md -%}) for tips regarding that.

## Installation

To install a plugin just include the plugin **after** Raven has been loaded and the Raven global variable is registered. This happens automatically if you install from a CDN with the required plugins in the URL.

-   [React]({%- link _documentation/clients/javascript/integrations/react.md -%})
-   [Vue.js (2.0)]({%- link _documentation/clients/javascript/integrations/vue.md -%})

## AngularJS

To use Sentry with your AngularJS (1.x) application, you will need to use both Raven.js (Sentry’s browser JavaScript SDK) and the Raven.js AngularJS plugin.

On its own, Raven.js will report any uncaught exceptions triggered from your application. For advanced usage examples of Raven.js, please read [_Raven.js usage_]({%- link _documentation/clients/javascript/usage.md -%}).

Additionally, the Raven.js AngularJS plugin will catch any AngularJS-specific exceptions reported through AngularJS’s `$exceptionHandler` interface.

**Note**: This documentation is for Angular 1.x. See also: [_Angular 2.x_]({%- link _documentation/clients/javascript/integrations/index.md -%})

<!-- WIZARD -->
### Installation

Raven.js and the Raven.js Angular plugin are distributed using a few different methods.

#### Using our CDN

For convenience, our CDN serves a single, minified JavaScript file containing both Raven.js and the Raven.js AngularJS plugin. It should be included **after** Angular, but **before** your application code.

Example:

```html
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js"></script>
<script src="https://cdn.ravenjs.com/3.26.4/angular/raven.min.js" crossorigin="anonymous"></script>
<script>Raven.config('___PUBLIC_DSN___').install();</script>
```

Note that this CDN build auto-initializes the Angular plugin.

#### Using package managers

Pre-built distributions of Raven.js and the Raven.js AngularJS plugin are available via both Bower and npm.

##### Bower

```sh
$ bower install raven-js --save
```

```html
<script src="/bower_components/angular/angular.js"></script>
<script src="/bower_components/raven-js/dist/raven.js"></script>
<script src="/bower_components/raven-js/dist/plugins/angular.js"></script>
<script>
  Raven
    .config('___PUBLIC_DSN___')
    .addPlugin(Raven.Plugins.Angular)
    .install();
</script>
```

##### npm

```sh
$ npm install raven-js --save
```

```html
<script src="/node_modules/angular/angular.js"></script>
<script src="/node_modules/raven-js/dist/raven.js"></script>
<script src="/node_modules/raven-js/dist/plugins/angular.js"></script>
<script>
  Raven
    .config('___PUBLIC_DSN___')
    .addPlugin(Raven.Plugins.Angular)
    .install();
</script>
```

These examples assume that AngularJS is exported globally as _window.angular_. You can alternatively pass a reference to the _angular_ object directly as the second argument to _addPlugin_:

```javascript
Raven.addPlugin(Raven.Plugins.Angular, angular);
```

#### Module loaders (CommonJS)

Raven and the Raven AngularJS plugin can be loaded using a module loader like Browserify or Webpack.

```javascript
var angular = require('angular');
var Raven = require('raven-js');

Raven
  .config('___PUBLIC_DSN___')
  .addPlugin(require('raven-js/plugins/angular'), angular)
  .install();
```

Note that when using CommonJS-style imports, you must pass a reference to _angular_ as the second argument to _addPlugin_.

### AngularJS Configuration

Inside your main AngularJS application module, you need to declare _ngRaven_ as a module dependency:

```javascript
var myApp = angular.module('myApp', [
  'ngRaven',
  'ngRoute',
  'myAppControllers',
  'myAppFilters'
]);
```

#### Module loaders (CommonJS) {#id1}

The raven angular module can be loaded using a module loader like Browserify or Webpack.

```javascript
var angular = require('angular');
var ngRaven = require('raven-js/plugins/angular').moduleName;
var ngRoute = require('angular-route');

var myAppFilters = require('./myAppFilters');
var myAppControllers = require('./myAppControllers');
var moduleName = 'myApp';

angular.module(moduleName, [
  ngRaven,
  ngRoute,
  myAppControllers,
  myAppFilters,
]);

module.exports = moduleName;
```
<!-- ENDWIZARD -->

## Angular

This document uses Angular to refer to Angular 2+. On its own, Raven.js will report any uncaught exceptions triggered from your application. For advanced usage examples of Raven.js, please read [_Raven.js usage_]({%- link _documentation/clients/javascript/usage.md -%}).

Additionally, Raven.js can be configured to catch any Angular-specific (2.x) exceptions reported through the [@angular/core/ErrorHandler](https://angular.io/api/core/ErrorHandler) component.

### TypeScript Support

Raven.js ships with a [TypeScript declaration file](https://github.com/getsentry/raven-js/blob/master/packages/raven-js/typescript/raven.d.ts), which helps static checking correctness of Raven.js API calls, and facilitates auto-complete in TypeScript-aware IDEs like Visual Studio Code.

<!-- WIZARD -->
### Installation

Raven.js should be installed via npm.

```sh
$ npm install raven-js --save
```

### Configuration

Configuration depends on which module loader/packager you are using to build your Angular application.

Below are instructions for [SystemJS](https://github.com/systemjs/systemjs), followed by instructions for [Webpack](https://webpack.github.io/), Angular CLI, and other module loaders/packagers.

#### SystemJS

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

#### Angular CLI

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
<!-- ENDWIZARD -->

## Backbone

<!-- WIZARD -->
### Installation

Start by adding the `raven.js` script tag to your page. It should be loaded as early as possible.

```html
<script src="https://cdn.ravenjs.com/3.26.4/raven.min.js"
    crossorigin="anonymous"></script>
```

### Configuring the Client

Next configure Raven.js to use your Sentry DSN:

```javascript
Raven.config('___PUBLIC_DSN___').install()
```

At this point, Raven is ready to capture any uncaught exception.
<!-- ENDWIZARD -->

## Ember

To use Sentry with your Ember application, you will need to use both Raven.js (Sentry’s browser JavaScript SDK) and the Raven.js Ember plugin.

On its own, Raven.js will report any uncaught exceptions triggered from your application. For advanced usage examples of Raven.js, please read [_Raven.js usage_]({%- link _documentation/clients/javascript/usage.md -%}).

Additionally, the Raven.js Ember plugin will catch any Ember-specific exceptions reported through Ember’s [onerror](https://guides.emberjs.com/v3.2.0/configuring-ember/debugging/#toc_implement-an-ember-onerror-hook-to-log-all-errors-in-production). hook and any [RSVP promises](https://guides.emberjs.com/v3.2.0/configuring-ember/debugging/#toc_errors-within-an-code-rsvp-promise-code) that would otherwise be swallowed.

<!-- WIZARD -->
### Installation

Raven.js and the Raven.js Ember plugin are distributed using a few different methods.

#### Using our CDN

For convenience, our CDN serves a single, minified JavaScript file containing both Raven.js and the Raven.js Ember plugin. It should be included **after** Ember, but **before** your application code.

Example:

```html
<script src="http://builds.emberjs.com/tags/v2.3.1/ember.prod.js"></script>
<script src="https://cdn.ravenjs.com/3.26.4/ember/raven.min.js" crossorigin="anonymous"></script>
<script>Raven.config('___PUBLIC_DSN___').install();</script>
```

Note that this CDN build auto-initializes the Ember plugin.

### Using package managers

Pre-built distributions of Raven.js and the Raven.js Ember plugin are available via both Bower and npm for importing in your `ember-cli-build.js` file.

##### Bower

```sh
$ bower install raven-js --save
```

```javascript
app.import('bower_components/raven-js/dist/raven.js');
app.import('bower_components/raven-js/dist/plugins/ember.js');
```

```html
<script src="assets/vendor.js"></script>
<script>
  Raven
    .config('___PUBLIC_DSN___')
    .addPlugin(Raven.Plugins.Ember)
    .install();
</script>
<script src="assets/your-app.js"></script>
```

##### npm

```sh
$ npm install raven-js --save
```

```javascript
app.import('node_modules/raven-js/dist/raven.js');
app.import('node_modules/raven-js/dist/plugins/ember.js');
```

```html
<script src="assets/vendor.js"></script>
<script>
  Raven
    .config('___PUBLIC_DSN___')
    .addPlugin(Raven.Plugins.Ember)
    .install();
</script>
<script src="assets/your-app.js"></script>
```

These examples assume that Ember is exported globally as `window.Ember`. You can alternatively pass a reference to the `Ember` object directly as the second argument to `addPlugin`:

```javascript
Raven.addPlugin(Raven.Plugins.Ember, Ember);
```
<!-- ENDWIZARD -->

