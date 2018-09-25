---
title: Node.js
sidebar_order: 9
---

raven-node is the official Node.js client for Sentry.

**Note**: If you’re using JavaScript in the browser, you’ll need [raven-js](https://docs.sentry.io/clients/javascript).

<!-- WIZARD installation -->
## Installation

Raven is distributed via `npm`:

```bash
$ npm install raven --save
```
<!-- ENDWIZARD -->

<!-- WIZARD configuration -->
## Configuring the Client

Next you need to initialize the Raven client and configure it to use your [Sentry DSN]({%- link _documentation/learn/quickstart.md -%}#configure-the-dsn):

```javascript
var Raven = require('raven');
Raven.config('___PUBLIC_DSN___').install();
```

At this point, Raven is set up to capture and report any uncaught exceptions.

You can optionally pass an object of configuration options as the 2nd argument to _Raven.config_. For more information, see [_Configuration_]({%- link _documentation/clients/node/config.md -%}).
<!-- ENDWIZARD -->

<!-- WIZARD reporting-errors -->
## Reporting Errors

Raven’s `install` method sets up a global handler to automatically capture any uncaught exceptions. You can also report errors manually with `try...catch` and a call to `captureException`:

```javascript
try {
    doSomething(a[0]);
} catch (e) {
    Raven.captureException(e);
}
```
<!-- ENDWIZARD -->

You can also use `wrap` and `context` to have Raven wrap a function and automatically capture any exceptions it throws:

```javascript
Raven.context(function () {
  doSomething(a[0]);
});
```

For more information on reporting errors, see [_Usage_]({%- link _documentation/clients/node/usage.md -%}).

## Adding Context

Code run via `wrap` or `context` has an associated set of context data, and Raven provides methods for managing that data.

You’ll most commonly use this to associate the current user with an exception:

```javascript
Raven.context(function () {
  Raven.setContext({
    user: {
      email: 'matt@example.com',
      id: '123'
    }
  });
  // errors thrown here will be associated with matt
});
// errors thrown here will not be associated with matt
```

This can also be used to set `tags` and `extra` keys for associated tags and extra data.

You can update the context data with `mergeContext` or retrieve it with `getContext`. When an exception is captured by a wrapper, the current context state will be passed as options to `captureException`.

See [context/wrap]({%- link _documentation/clients/node/usage.md -%}#raven-node-additional-context) for more.

## Breadcrumbs

Breadcrumbs are records of server and application lifecycle events that can be helpful in understanding the state of the application leading up to a crash.

We can capture breadcrumbs and associate them with a context, and then send them along with any errors captured from that context:

```javascript
Raven.context(function () {
  Raven.captureBreadcrumb({
    message: 'Received payment confirmation',
    category: 'payment',
    data: {
       amount: 312,
    }
  });
  // errors thrown here will have breadcrumb attached
});
```

Raven can be configured to automatically capture breadcrubs for certain events including:

> -   http/https requests
> -   console log statements
> -   postgres queries

For more information, see [Recording Breadcrumbs]({%- link _documentation/clients/node/usage.md -%}#raven-recording-breadcrumbs).

## Dealing with Minified Source Code

Raven and Sentry support [Source Maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/). If you provide source maps in addition to your minified files that data becomes available in Sentry. For more information see [Source Maps]({%- link _documentation/clients/node/sourcemaps.md -%}#raven-node-sourcemaps).

## Middleware and Integrations

If you’re using Node.js with a web server framework/library like Connect, Express, or Koa, it is recommended to configure one of Raven’s server middleware integrations. See [_Integrations_]({%- link _documentation/clients/node/integrations/index.md -%}).

## Deep Dive

For more detailed information about how to get most out of Raven there is additional documentation available that covers all the rest:

-   [Configuration]({%- link _documentation/clients/node/config.md -%})
-   [Usage]({%- link _documentation/clients/node/usage.md -%})
-   [Integrations]({%- link _documentation/clients/node/integrations/index.md -%})
    -   [Connect]({%- link _documentation/clients/node/integrations/connect.md -%})
    -   [Express]({%- link _documentation/clients/node/integrations/express.md -%})
    -   [Koa]({%- link _documentation/clients/node/integrations/koa.md -%})
    -   [Loopback]({%- link _documentation/clients/node/integrations/loopback.md -%})
    -   [Sails]({%- link _documentation/clients/node/integrations/sails.md -%})
-   [Source Maps]({%- link _documentation/clients/node/sourcemaps.md -%})
-   [Source Maps]({%- link _documentation/clients/node/typescript.md -%})
-   [CoffeeScript]({%- link _documentation/clients/node/coffeescript.md -%})

Resources:

-   [Bug Tracker](http://github.com/getsentry/sentry-javascript/issues)
-   [Github Project](http://github.com/getsentry/sentry-javascript)
