---
title: JavaScript
sidebar_order: 3
---

{% include learn-sdk.md platform="javascript" %}

&nbsp;
## Getting Started

### Integrating the SDK

All our JavaScript-related SDKs provide the same API. Still, there are some differences between them, such as installation, which this section of the docs explains.

**[Drop down here]**

[Dropdown which affects install instructions are shown (if nothing is provided in the URL, defaults to browser)]

- In the browser
- Angular
- Electron
    - Includes some minidump explanation, maybe redirects to the native page
- Ember
- Node.js
- React
    - Includes a note pointing to React Native
- Vue

The quickest way to get started is to use the CDN hosted version of the JavaScript browser SDK:

```
<script src="https://browser.sentry-cdn.com/4.5.3/bundle.min.js" crossorigin="anonymous"></script>

```

&nbsp;
### Configuring the SDK with your Data Source Name
After you completed setting up a project in Sentry, you’ll be given a value which we call a _DSN_, or _Data Source Name_. It looks a lot like a standard URL, but it’s actually just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.

**[Drop down here]**

You should `init` the Sentry Browser SDK as soon as possible during your page load:

```
Sentry.init({ dsn: 'https://<key>@sentry.io/<project>' });
```

Most SDKs will now automatically collect data if available, some require some extra configuration as automatic error collecting is not available due to platform limitations.

&nbsp;
### Capturing Errors/ Exceptions
In JavaScript you can pass an error object to `captureException()` to get it captured as an event.

```
try {
  aFunctionThatMightFail();
} catch (err) {
  Sentry.captureException(err);
}
```
**[Screenshot of what that ^^ looks like]**

{% capture __alert_content -%}
It's possible to throw strings as errors. In this case, the Sentry SDK will not record tracebacks
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

&nbsp;
### Automatically Capturing Errors
Sentry attaches global handlers to capture uncaught exceptions and unhandled rejections.

**[Example]**

&nbsp;
### Automatically Capturing Errors with Promises
By default, Sentry for JavaScript captures unhandled promise rejections as described in the official ECMAScript 6 standard.

**[Example Code]**

Configuration may be required if you are using a third-party library to implement promises:

Most promise libraries have a global hook for capturing unhandled errors. You may want to disable default behavior by setting `captureUnhandledRejections` option to `false` and manually hook into such event handler and call `Raven.captureException` or `Raven.captureMessage` directly.

For example, the [RSVP.js library](https://github.com/tildeio/rsvp.js/) (used by Ember.js) allows you to bind an event handler to a [global error event](https://github.com/tildeio/rsvp.js#error-handling).

```
RSVP.on('error', function(reason) {
  Raven.captureException(reason);
});
```

[Bluebird](http://bluebirdjs.com/docs/getting-started.html) and other promise libraries report unhandled rejections toa global DOM event, `unhandledrejection`. In this case, you don't need to do anything, we've already got you covered with default the `captureUnhandledRejections: true` setting.

Please consult your promise library documentation on how to hook into its global unhandled rejection handler, if it exposes one.

&nbsp;
### Releases
A release is a version of your code that is deployed to an environment. When you give Sentry information about your releases, you unlock a number of new features:
 - Determine the issue and regressions introduced in a new release
 - Predict which commit caused an issue and who is likely responsible
 - Resolve issues by including the issue number in your commit message
 - Receive email notifications when your code gets deployed

Additionally, releases are used for applying [source maps]({%- link _documentation/platforms/javascript/sourcemaps/index.md -%})

Setting up releases is a 3-step process:
1. [Configure Your SDK]({%- link _documentation/workflow/releases.md -%}#configure-sdk)
2. [Create Release and Associate Commits]({%- link _documentation/workflow/releases.md -%}#create-release)
3. [Tell Sentry When You Deploy a Release]({%- link _documentation/workflow/releases.md -%}#create-deploy)

&nbsp;
### Setting Context
Sentry supports additional context with events. Often this context is shared amongst any issue captured in its lifecycle, and includes the following components:

**Structured Contexts**

: Specific structured contexts (OS info, runtime information etc.).  This is normally set automatically.

[**User**](#capturing-the-user)

: Information about the current actor

[**Tags**](#tagging-events)

: Key/value pairs which generate breakdowns charts and search filters

[**Level**](#setting-the-level)

: An event's severity 

[**Fingerprint**](#setting-the-fingerprint)

: A value used for grouping events into issues

[**Unstructured Extra Data**](#extra-context)

: Arbitrary unstructured data which is stored with an event sample

&nbsp;
## Capturing the User

Sending users to Sentry will unlock a number of features, primarily the ability to drill down into the number of users affecting an issue, as well to get a broader sense about the quality of the application.

Capturing the user is fairly straight forward:

```
Sentry.configureScope((scope) => {
  scope.setUser({"email": "john,doe@example.com"});
});
```

Users consist of a few key pieces of information which are used to construct a unique identity in Sentry. Each of these is optional, but one **must** be present in order for the user to be captured:

`id`

: Your internal identifier for the user.

`username`

: The username. Generally used as a better label than the internal ID.

`email`

: An alternative to a username (or addition). Sentry is aware of email addresses and can show things like Gravatars, unlock messaging capabilities, and more.

`ip_address`

: The IP address of the user. If the user is unauthenticated providing the IP address will suggest that this is unique to that IP. We will attempt to pull this from HTTP request data if available.

Additionally you can provide arbitrary key/value pairs beyond the reserved names and those will be stored with the user.

&nbsp;
## Tagging Events

Sentry implements a system it calls tags. Tags are various key/value pairs that get assigned to an event, and can later be used as a breakdown or quick access to finding related events.

Most SDKs generally support configuring tags by configuring the scope:

{% include components/platform_content.html content_dir='set-tag' %}

Several common uses for tags include:

-   The hostname of the server
-   The version of your platform (e.g. iOS 5.0)
-   The user’s language

Once you’ve starting sending tagged data, you’ll see it show up in a few places:

-   The filters within the sidebar on the project stream page.
-   Summarized within an event on the sidebar.
-   The tags page on an aggregated event.

We’ll automatically index all tags for an event, as well as the frequency and the last time a value has been seen. Even more so, we keep track of the number of distinct tags, and can assist in you determining hotspots for various issues.

****BIG TEST****

****BIG TEST****

****BIG TEST****

****BIG TEST****

****BIG TEST****


All our JavaScript-related SDKs provide the same API still there are some differences between them which this section of the docs explains.

## Browser Compatibility

Our JavaScript SDK supports all major browsers. In older browsers, error reports may have a degraded level of detail – for example, missing stack trace data or missing source code column numbers.

The table below shows supported browsers:

![Sauce Test Status](https://saucelabs.com/browser-matrix/sentryio.svg)

{% capture __alert %}
Our SDK needs a polyfill for `Promise` in older browsers like IE 11 and below. 
Please add this script tag below before loading our SDK. 
If you are using the npm package please use a polyfill for `Promise` respectively.
```
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Promise"></script>
```

Additionally, keep in mind to also define `<!doctype html>` on top of your html page, 
to make sure IE does not go into compatibility mode.
{% endcapture %}

{% include components/alert.html
  title="Support for <= IE 11"
  content=__alert
  level="warning"
%}

## Integrations

All of our SDKs provide _Integrations_, which can be seen as some kind of plugins. All JavaScript SDKs provide default _Integrations_; please check details of a specific SDK to see which _Integrations_ it provides.

One thing is the same across all our JavaScript SDKs and that's how you add or remove _Integrations_, e.g.: for `@sentry/browser`.

### Adding an Integration

```javascript
import * as Sentry from '@sentry/browser';

// All integration that come with an SDK can be found on Sentry.Integrations object
// Custom integration must conform Integration interface: https://github.com/getsentry/sentry-javascript/blob/master/packages/types/src/index.ts

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [new MyAwesomeIntegration()]
});
```

### Removing an Integration

In this example we will remove the by default enabled integration for adding breadcrumbs to the event:

```javascript
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: integrations => {
    // integrations will be all default integrations
    return integrations.filter(integration => integration.name !== 'Breadcrumbs');
  }
});
```

### Alternative way of setting an Integration

```javascript
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: integrations => {
    // integrations will be all default integrations
    return [...integrations, new MyCustomIntegration()];
  }
});
```

## Hints

Event and Breadcrumb `hints` are objects containing various information used to put together an event or a breadcrumb. For events, those are things like `event_id`, `originalException`, `syntheticException` (used internally to generate cleaner stack trace), and any other arbitrary `data` that user attaches. For breadcrumbs it's all implementation dependent. For XHR requests, hint contains xhr object itself, for user interactions it contains DOM element and event name etc.

They are available in two places. `beforeSend`/`beforeBreadcrumb` and `eventProcessors`. Those are two ways we'll allow users to modify what we put together.

These common hints currently exist for events:

`originalException`

: The original exception that caused the event to be created. This is useful for changing how events
are grouped or to extract additional information.

`syntheticException`

: When a string or a non error object is raised, Sentry creates a synthetic exception so you can get a
basic stack trace. This exception is stored here for further data extraction.

And these exist for breadcrumbs:

`event`

: For breadcrumbs created from browser events the event is often supplied to the breadcrumb as hint. This
for instance can be used to extract data from the target DOM element into a breadcrumb.

`level` / `input`

: For breadcrumbs created from console log interceptions this holds the original console log level and the
original input data to the log function.

`response` / `input`

: For breadcrumbs created from HTTP requests this holds the response object
(from the fetch api) and the input parameters to the fetch function.

`request` / `response` / `event`

: For breadcrumbs created from HTTP requests this holds the request and response object
(from the node HTTP API) as well as the node event (`response` or `error`).

`xhr`

: For breadcrumbs created from HTTP requests done via the legacy `XMLHttpRequest` API this holds
the original xhr object.

## EventProcessors

With `eventProcessors` you are able to hook into the process of enriching the event with additional data.
You can add you own `eventProcessor` on the current scope. The difference to `beforeSend` is that
`eventProcessors` run on the scope level where `beforeSend` runs globally not matter in which scope you are.
`eventProcessors` also optionally receive the hint see: [Hints](#hints).

```javascript
// This will be set globally for every succeeding event send
Sentry.configureScope(scope => {
  scope.addEventProcessor((event, hint) => {
    // Add anything to the event here
    // returning null will drop the event
    return event;
  });
});

// Using withScope, will only call the event processor for all "sends"
// that happen within withScope
Sentry.withScope(scope => {
  scope.addEventProcessor((event, hint) => {
    // Add anything to the event here
    // returning null will drop the event
    return event;
  });
  Sentry.captureMessage('Test');
});
```
