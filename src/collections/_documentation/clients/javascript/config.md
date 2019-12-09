---
title: Configuration
sidebar_order: 1
robots: noindex
---

To get started, you need to configure Raven.js to use your Sentry DSN:

```javascript
Raven.config('___PUBLIC_DSN___').install()
```

At this point, Raven is ready to capture any uncaught exception.

## Optional settings

`Raven.config()` can optionally be passed an additional argument for extra configuration:

```javascript
Raven.config('___PUBLIC_DSN___', {
    release: 'myapp@1.3.0'
}).install()
```

Those configuration options are documented below:

`logger`

: The name of the logger used by Sentry. Default: `javascript`

  ```javascript
  {
    logger: 'javascript'
  }
  ```

`release`

: Track the version of your application in Sentry.

  ```javascript
  {
    release: '721e41770371db95eee98ca2707686226b993eda'
  }
  ```

  Can also be defined with `Raven.setRelease('721e41770371db95eee98ca2707686226b993eda')`. To learn more about configuring releases and deploys, click [here]({%- link _documentation/workflow/releases.md -%}).

`environment`

: Track the environment name inside Sentry.

  ```javascript
  {
    environment: 'production'
  }
  ```

`serverName`

: {% version_added 1.3.0. %}

  Typically this would be the server name, but that doesn’t exist on all platforms. Instead, you may use something like the device ID, as it indicates the host which the client is running on.

  ```javascript
  {
    serverName: device.uuid
  }
  ```

`tags`

: Additional [tags]({%- link _documentation/enriching-error-data/context.md -%}#tagging-events) to assign to each event.

  ```javascript
  {
    tags: {git_commit: 'c0deb10c4'}
  }
  ```

`whitelistUrls`

: The inverse of `ignoreUrls`. Only report errors from whole URLs matching a regex pattern or an exact string. `whitelistUrls` should match the URL of your actual JavaScript files. It should match the URL of your site if and only if you are inlining code inside `<script>` tags. Not setting this value is equivalent to a catch-all and will not filter out any values.

  ```javascript
  {
    whitelistUrls: [/getsentry\.com/]
  }
  ```

`ignoreErrors`

: Very often, you will come across specific errors that are a result of something other than your application, or errors that you’re completely not interested in. _ignoreErrors_ is a list of these messages to be filtered out before being sent to Sentry as either regular expressions or strings. When using strings, they’ll partially match the messages, so if you need to achieve an exact match, use RegExp patterns instead.

  ```javascript
  {
    ignoreErrors: ['fb_xd_fragment', /^Exact Match Message$/]
  }
  ```

`ignoreUrls`

: The inverse of `whitelistUrls` and similar to `ignoreErrors`, but will ignore errors from whole URLs matching a regex pattern or an exact string.

  ```javascript
  {
    ignoreUrls: [/graph\.facebook\.com/, 'http://example.com/script2.js']
  }
  ```

`includePaths`

: An array of regex patterns to indicate which URLs are a part of your app in the stack trace. All other frames will appear collapsed inside Sentry to make it easier to discern between frames that happened in your code vs other code. It’d be suggested to add the current page URL, and the host for your CDN.

  ```javascript
  {
      includePaths: [/https?:\/\/getsentry\.com/, /https?:\/\/cdn\.getsentry\.com/]
  }
  ```

`sampleRate`

: A sampling rate to apply to events. A value of 0.0 will send no events, and a value of 1.0 will send all events (default).

  ```javascript
  {
      sampleRate: 0.5 // send 50% of events, drop the other half
  }
  ```

`sanitizeKeys`

: An array of strings or regex patterns representing keys that should be scrubbed from the payload sent to Sentry. We’ll go through every field in the payload and mask the values with simple _********_ string instead. This will match _only_ keys of the object, not the values. Sentry also sanitizes all events sent to it on the server-side, but this allows you to strip the payload before it gets to the server.

  ```javascript
  {
      sanitizeKeys: [/_token$/, /password/i, 'someHidiousKey']
  }
  ```

`dataCallback`

: A function that allows mutation of the data payload right before being sent to Sentry.

  ```javascript
  {
      dataCallback: function(data) {
        // do something to data
        return data;
      }
  }
  ```

`breadcrumbCallback`

: A function that allows filtering or mutating breadcrumb payloads. Return false to throw away the breadcrumb.

  ```javascript
  {
      breadcrumbCallback: function(crumb) {
        if (crumb.type === 'http') {
          return crumb;
        }

        return false;
      }
  }
  ```

`shouldSendCallback`

: A callback function that allows you to apply your own filters to determine if the message should be sent to Sentry.

  ```javascript
  {
      shouldSendCallback: function(data) {
        return false;
      }
  }
  ```

`maxMessageLength`

: By default, Raven does not truncate messages. If you need to truncate characters for whatever reason, you may set this to limit the length.

`maxUrlLength`

: By default, Raven will truncate URLs as they appear in breadcrumbs and other meta interfaces to 250 characters in order to minimize bytes over the wire. This does _not_ affect URLs in stack traces.

`autoBreadcrumbs`

: Enables/disables automatic collection of breadcrumbs. Possible values are:

  -   _true_ (default)
  -   _false_ - all breadcrumb collection disabled
  -   A dictionary of individual breadcrumb types that can be enabled/disabled:

  ```javascript
  autoBreadcrumbs: {
      'xhr': false,      // XMLHttpRequest
      'console': false,  // console logging
      'dom': true,       // DOM interactions, i.e. clicks/typing
      'location': false, // url changes, including pushState/popState
      'sentry': true     // sentry events
  }
  ```

`maxBreadcrumbs`

: By default, Raven captures as many as 100 breadcrumb entries. If you find this too noisy, you can reduce this number by setting _maxBreadcrumbs_. Note that this number cannot be set higher than the default of 100.

`captureUnhandledRejections`

: By default, Raven captures all unhandled promise rejections using standard `unhandledrejection` event. If you want to disable this behavior, set this option to `false`.

`transport`

: Override the default HTTP data transport handler.

  Alternatively, can be specified using `Raven.setTransport(myTransportFunction)`.

  ```javascript
  {
      transport: function (options) {
          // send data
      }
  }
  ```

  The provided function receives a single argument, `options`, with the following properties:

  url

  : The target url where the data is sent.

  data

  : The outbound exception data.

    For POST requests, this should be JSON-encoded and set as the HTTP body (and transferred as Content-type: application/json).

    For GET requests, this should be JSON-encoded and passed over the query string with key `sentry_data`.

  auth

  : An object representing authentication data. This should be converted to urlencoded key/value pairs and passed as part of the query string, for both GET and POST requests.

    The auth object has the following properties:

    sentry_version

    : The API version of the Sentry server.

    sentry_client

    : The name and version of the Sentry client of the form `client/version`. In this case, `raven-js/${Raven.VERSION}`.

    sentry_key

    : Your public client key (DSN).

  options

  : Include all top-level options described.

  onSuccess

  : Callback to be invoked upon a successful request.

  onError

  : Callback to be invoked upon a failed request.

`headers`

: Pass custom headers to server requests for `fetch` or `XMLHttpRequest`.

  ```javascript
  {
      headers: {
          'CSRF-TOKEN': '12345'
      }
  }
  ```

  Headers value can be in the form of a function, to the compute value in time of a request:

  ```javascript
  {
      headers: {
          'CSRF-TOKEN': function() {
              // custom logic that will be computed on every request
              return new Date();
          }
      }
  }
  ```

`fetchParameters`

: `fetch()` init parameters ([https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)).

  Setting `keepalive: true` parameter will allow SDK to send events in `unload` and `beforeunload` handlers.
  However, it'll also restrict the size of a single event to 64kB, per [fetch specification](https://fetch.spec.whatwg.org/#http-network-or-cache-fetch) (point 8.5).

  Defaults:

  ```javascript
  {
      method: 'POST',
      referrerPolicy: 'origin'
  }
  ```

`allowDuplicates`

: By default, Raven.js attempts to suppress duplicate captured errors and messages that occur back-to-back. Such events are often triggered by rogue code (e.g. from a _setInterval_ callback in a browser extension), are not actionable, and eat up your event quota.

  To disable this behavior (for example, when testing), set `allowDuplicates: true` during configuration.

`allowSecretKey`

: By default, Raven.js will throw an error if configured with a Sentry DSN that contains a secret key. When using Raven.js with a web application accessed via a browser over the web, you should only use your public DSN. But if you are using Raven.js in an environment like React Native or Electron, where your application is running “natively” on a device and not accessed at a web address, you may need to use your secret DSN string. To do so, set `allowSecretKey: true` during configuration.

`debug`

: If set to _true_, Raven.js outputs some light debugging information onto the console.

`instrument`

: Enables/disables instrumentation of globals. Possible values are:

  -   _true_ (default)
  -   _false_ - all instrumentation disabled
  -   A dictionary of individual instrumentation types that can be enabled/disabled:

  ```javascript
  instrument: {
      'tryCatch': true, // Instruments timers and event targets
  }
  ```

## Putting it all together

```html
<!doctype html>
<html>
<head>
    <title>Awesome stuff happening here</title>
</head>
<body>
    ...
    <script src="jquery.min.js"></script>
    <script src="https://cdn.ravenjs.com/3.26.4/raven.min.js"
        crossorigin="anonymous"></script>
    <script>
        Raven.config('___PUBLIC_DSN___', {
            logger: 'my-logger',
            whitelistUrls: [
                /disqus\.com/,
                /getsentry\.com/
            ],
            ignoreErrors: [
                'fb_xd_fragment',
                /ReferenceError:.*/
            ],
            includePaths: [
                /https?:\/\/(www\.)?getsentry\.com/
            ]
        }).install();
    </script>
    <script src="myapp.js"></script>
</body>
</html>
```
