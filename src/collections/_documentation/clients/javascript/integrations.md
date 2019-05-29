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

## AngularJS

To use Sentry with your AngularJS (1.x) application, you will need to use both Raven.js (Sentry’s browser JavaScript SDK) and the Raven.js AngularJS plugin.

On its own, Raven.js will report any uncaught exceptions triggered from your application. For advanced usage examples of Raven.js, please read [_Raven.js usage_]({%- link _documentation/clients/javascript/usage.md -%}).

Additionally, the Raven.js AngularJS plugin will catch any AngularJS-specific exceptions reported through AngularJS’s `$exceptionHandler` interface.

**Note**: This documentation is for Angular 1.x. See also: [_Angular 2.x_](#angular).

<!-- WIZARD angularjs -->
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
<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->

## Angular

This document uses Angular to refer to Angular 2+. On its own, Raven.js will report any uncaught exceptions triggered from your application. For advanced usage examples of Raven.js, please read [_Raven.js usage_]({%- link _documentation/clients/javascript/usage.md -%}).

Additionally, Raven.js can be configured to catch any Angular-specific (2.x) exceptions reported through the [@angular/core/ErrorHandler](https://angular.io/api/core/ErrorHandler) component.

### TypeScript Support

Raven.js ships with a [TypeScript declaration file](https://github.com/getsentry/raven-js/blob/master/packages/raven-js/typescript/raven.d.ts), which helps static checking correctness of Raven.js API calls, and facilitates auto-complete in TypeScript-aware IDEs like Visual Studio Code.

<!-- WIZARD angular -->
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
<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->

## Backbone

<!-- WIZARD backbone -->
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
<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->

## Ember

To use Sentry with your Ember application, you will need to use both Raven.js (Sentry’s browser JavaScript SDK) and the Raven.js Ember plugin.

On its own, Raven.js will report any uncaught exceptions triggered from your application. For advanced usage examples of Raven.js, please read [_Raven.js usage_]({%- link _documentation/clients/javascript/usage.md -%}).

Additionally, the Raven.js Ember plugin will catch any Ember-specific exceptions reported through Ember’s [onerror](https://guides.emberjs.com/v3.2.0/configuring-ember/debugging/#toc_implement-an-ember-onerror-hook-to-log-all-errors-in-production). hook and any [RSVP promises](https://guides.emberjs.com/v3.2.0/configuring-ember/debugging/#toc_errors-within-an-code-rsvp-promise-code) that would otherwise be swallowed.

<!-- WIZARD ember -->
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

## React

<!-- WIZARD react -->
### Installation

Start by adding the `raven.js` script tag to your page. It should be loaded as early as possible, before your main JavaScript bundle.

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
### Expanded Usage

If you’re using React 16 or above, [Error Boundaries](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html) are an important tool for defining the behavior of your application in the face of errors. Be sure to send errors they catch to Sentry using `Raven.captureException`, and optionally this is also a great opportunity to surface [User Feedback]({%- link _documentation/enriching-error-data/user-feedback.md -%})

```jsx
class ExampleBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error });
        Raven.captureException(error, { extra: errorInfo });
    }

    render() {
        if (this.state.error) {
            //render fallback UI
            return (
                <div
                className="snap"
                onClick={() => Raven.lastEventId() && Raven.showReportDialog()}>
                    <img src={oops} />
                    <p>We're sorry — something's gone wrong.</p>
                    <p>Our team has been notified, but click here fill out a report.</p>
                </div>
            );
        } else {
            //when there's not an error, render children untouched
            return this.props.children;
        }
    }
}
```

```html
<div>
    <ExampleBoundary>
        <h2>Sidebar</h2>
        <Widget/>
    </ExampleBoundary>
    <p> This content won't unmount when Widget throws. </p>
</div>
```

One important thing to note about the behavior of error boundaries in development mode is that React will rethrow errors they catch. This will result in errors being reported twice to Sentry with the above setup, but this won’t occur in your production build.

Read more about error boundaries [in this blog post](https://blog.sentry.io/2017/09/28/react-16-error-boundaries).

### Redux

If you use [Redux](https://github.com/reactjs/redux) there are some useful community maintained middleware packages for annotating error reports with useful information, such as store state and recent actions:

-   [captbaritone/raven-for-redux](https://github.com/captbaritone/raven-for-redux)
-   [ngokevin/redux-raven-middleware](https://github.com/ngokevin/redux-raven-middleware)

### Redux Sagas Middleware

If you’re using [Redux Saga](https://github.com/redux-saga/redux-saga) be aware that it does not bubble errors up to the browsers uncaught exception handler.

You may specify an error handler that captures saga exceptions by passing an `onError` function to the `createSagaMiddleware` options, and call `Raven.captureException` inside that callback. See the [Redux Saga documentation](https://redux-saga.js.org/docs/api/#createsagamiddlewareoptions) for more details.

## Vue.js (2.0) {#vue}

{% capture __alert_content -%}
This plugin only works with Vue 2.0 or greater.
{%- endcapture -%}
{%- include components/alert.html
  level="warning"
  title="Support"
  content=__alert_content
%}

To use Sentry with your Vue application, you will need to use both Raven.js (Sentry’s browser JavaScript SDK) and the Raven.js Vue plugin.

On its own, Raven.js will report any uncaught exceptions triggered from your application. For advanced usage examples of Raven.js, please read [_Raven.js usage_]({%- link _documentation/clients/javascript/usage.md -%}).

Additionally, the Raven.js Vue plugin will capture the name and props state of the active component where the error was thrown. This is reported via Vue’s _config.errorHandler_ hook.

<!-- WIZARD vue -->
### Installation

Raven.js and the Raven.js Vue plugin are distributed using a few different methods.

#### Using our CDN

For convenience, our CDN serves a single, minified JavaScript file containing both Raven.js and the Raven.js Vue plugin. It should be included **after** Vue, but **before** your application code.

Example:

```html
<script src="https://cdn.jsdelivr.net/vue/2.0.0-rc/vue.min.js"></script>
<script src="https://cdn.ravenjs.com/3.26.4/vue/raven.min.js" crossorigin="anonymous"></script>
<script>Raven.config('___PUBLIC_DSN___').install();</script>
```

Note that this CDN build auto-initializes the Vue plugin.

#### Using package managers

Both Raven.js and the Raven.js Vue plugin can be installed via npm and Bower.

##### npm

```sh
$ npm install raven-js --save
```

```html
<script src="/node_modules/vue/dist/vue.js"></script>
<script src="/node_modules/raven-js/dist/raven.js"></script>
<script src="/node_modules/raven-js/dist/plugins/vue.js"></script>
<script>
  Raven
    .config('___PUBLIC_DSN___')
    .addPlugin(Raven.Plugins.Vue)
    .install();
</script>
```

##### Bower

```sh
$ bower install raven-js --save
```

```html
<script src="/bower_components/vue/dist/vue.js"></script>
<script src="/bower_components/raven-js/dist/raven.js"></script>
<script src="/bower_components/raven-js/dist/plugins/vue.js"></script>
<script>
  Raven
    .config('___PUBLIC_DSN___')
    .addPlugin(Raven.Plugins.Vue)
    .install();
</script>
```

These examples assume that Vue is exported globally as _window.Vue_. You can alternatively pass a reference to the _Vue_ object directly as the second argument to _addPlugin_:

```javascript
Raven.addPlugin(Raven.Plugins.Vue, Vue);
```

#### Module loaders

In your main application file, import and configure both Raven.js and the Raven.js Vue plugin as follows:

```js
import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

Raven
    .config('___PUBLIC_DSN___')
    .addPlugin(RavenVue, Vue)
    .install();
```

<!-- ENDWIZARD -->

## Deprecated React Native

The deprecated plugin “React Native for Raven.js” is a pure JavaScript error reporting solution. The plugin will report errors originating from React Native’s JavaScript engine (e.g. programming errors like “x is undefined”), but might not catch errors that originate from the underlying operating system (iOS / Android) unless they happen to be transmitted to React Native’s global error handler.

**Do not use this plugin for new code but instead use the new :ref:`react-native` client integration instead**.

{% capture __alert_content -%}
Unless you have specific reasons not to, it’s recommended to instead the new [React Native]({%- link _documentation/clients/react-native/index.md -%}#react-native) client instead which supports native and JavaScript crashes as well as an improved integration into the Xcode build process.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

### Installation

In the root of your React Native project, install raven-js via npm:

```bash
$ npm install --save raven-js
```

At the top of your main application file (e.g. index.ios.js and/or index.android.js), add the following code:

```javascript
var React = require('react');

var Raven = require('raven-js');
require('raven-js/plugins/react-native')(Raven);
```

### Configuring the Client

Now we need to set up Raven.js to use your Sentry DSN:

```javascript
Raven
  .config('___PUBLIC_DSN___', { release: RELEASE_ID })
  .install();
```

RELEASE_ID is a string representing the “version” of the build you are about to distribute. This can be the SHA of your Git repository’s HEAD. It can also be a semantic version number (e.g. “1.1.2”), pulled from your project’s package.json file. More below.

### About Releases

Every time you build and distribute a new version of your React Native app, you’ll want to create a new release inside Sentry. This is for two important reasons:

-   You can associate errors tracked by Sentry with a particular build
-   You can store your source files/source maps generated for each build inside Sentry

Unlike a normal web application where your JavaScript files (and source maps) are served and hosted from a web server, your React Native code is being served from the target device’s filesystem. So you’ll need to upload both your **source code** AND **source maps** directly to Sentry, so that we can generate handy stack traces for you to browse when examining exceptions triggered by your application.

### Generating and Uploading Source Files/Source Maps {#generating-and-uploading-source-files-source-maps}

To generate both an application JavaScript file (main.jsbundle) and source map for your project (main.jsbundle.map), use the react-native CLI tool:

```bash
react-native bundle \
  --dev false \
  --platform ios \
  --entry-file index.ios.js \
  --bundle-output main.jsbundle \
  --sourcemap-output main.jsbundle.map
```

This will write both main.jsbundle and main.jsbundle.map to the current directory. Next, you’ll need to [create a new release and upload these files as release artifacts]({%- link _documentation/clients/javascript/sourcemaps.md -%}#uploading-source-maps-to-sentry).

#### Naming your Artifacts

In Sentry, artifacts are designed to be “named” using the full URL or path at which that artifact is located (e.g. _https://example.org/app.js_ or _/path/to/file.js/_). Since React Native applications are installed to a user’s device, on a path that includes unique device identifiers (and thus different for every user), the React Native plugin strips the entire path leading up to your application root.

This means that although your code may live at the following path:

```
/var/containers/Bundle/Application/{DEVICE_ID}/HelloWorld.app/main.jsbundle
```

The React Native plugin will reduce this to:

```
/main.jsbundle
```

Therefore in this example, you should name your artifacts as “/main.jsbundle” and “/main.jsbundle.map”.

### Source Maps with the Simulator

When developing with the simulator, it is not necessary to build source maps manually, as they are generated automatically on-demand.

Note however that artifact names are completely different when using the simulator. This is because instead of those files existing on a path on a device, they are served over HTTP via the [React Native packager](https://github.com/facebook/metro).

Typically, simulator assets are served at the following URLs:

-   Bundle: [http://localhost:8081/index.ios.bundle?platform=ios&dev=true](http://localhost:8081/index.ios.bundle?platform=ios&dev=true)
-   Source map: [http://localhost:8081/index.ios.map?platform=ios&dev=true](http://localhost:8081/index.ios.map?platform=ios&dev=true)

If you want to evaluate Sentry’s source map support using the simulator, you will need to fetch these assets at these URLs (while the React Native packager is running), and upload them to Sentry as artifacts. They should be named using the full URL at which they are located, including the query string.

### Expanded Usage

It’s likely you’ll end up in situations where you want to gracefully handle errors. A good pattern for this would be to setup a logError helper:

```javascript
function logException(ex, context) {
  Raven.captureException(ex, {
    extra: context
  });
  /*eslint no-console:0*/
  window.console && console.error && console.error(ex);
}
```

Now in your components (or anywhere else), you can fail gracefully:

```javascript
var Component = React.createClass({
    render() {
        try {
            // ..
        } catch (ex) {
            logException(ex);
        }
    }
});
```
