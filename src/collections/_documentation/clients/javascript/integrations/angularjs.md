---
title: AngularJS
sidebar_order: 6
---

To use Sentry with your AngularJS (1.x) application, you will need to use both Raven.js (Sentry’s browser JavaScript SDK) and the Raven.js AngularJS plugin.

On its own, Raven.js will report any uncaught exceptions triggered from your application. For advanced usage examples of Raven.js, please read [_Raven.js usage_]({%- link _documentation/clients/javascript/usage.md -%}).

Additionally, the Raven.js AngularJS plugin will catch any AngularJS-specific exceptions reported through AngularJS’s `$exceptionHandler` interface.

**Note**: This documentation is for Angular 1.x. See also: [_Angular 2.x_]({%- link _documentation/clients/javascript/integrations/angular.md -%})

## Installation

Raven.js and the Raven.js Angular plugin are distributed using a few different methods.

### Using our CDN

For convenience, our CDN serves a single, minified JavaScript file containing both Raven.js and the Raven.js AngularJS plugin. It should be included **after** Angular, but **before** your application code.

Example:

```html
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js"></script>
<script src="https://cdn.ravenjs.com/3.26.4/angular/raven.min.js" crossorigin="anonymous"></script>
<script>Raven.config('___PUBLIC_DSN___').install();</script>
```

Note that this CDN build auto-initializes the Angular plugin.

### Using package managers

Pre-built distributions of Raven.js and the Raven.js AngularJS plugin are available via both Bower and npm.

#### Bower

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

#### npm

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

### Module loaders (CommonJS)

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

## AngularJS Configuration

Inside your main AngularJS application module, you need to declare _ngRaven_ as a module dependency:

```javascript
var myApp = angular.module('myApp', [
  'ngRaven',
  'ngRoute',
  'myAppControllers',
  'myAppFilters'
]);
```

### Module loaders (CommonJS) {#id1}

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
