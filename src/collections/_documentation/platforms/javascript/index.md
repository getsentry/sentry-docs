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

```
Sentry.configureScope((scope) => {
  scope.setTag("page_locale", "de-at");
});
```

Several common uses for tags include:

-   The hostname of the server
-   The version of your platform (e.g. iOS 5.0)
-   The user’s language

Once you’ve starting sending tagged data, you’ll see it show up in a few places:

-   The filters within the sidebar on the project stream page.
-   Summarized within an event on the sidebar.
-   The tags page on an aggregated event.

We’ll automatically index all tags for an event, as well as the frequency and the last time a value has been seen. Even more so, we keep track of the number of distinct tags, and can assist in you determining hotspots for various issues.

&nbsp;
## Setting the Level

You can set the severity of an event to one of five values: 'fatal', 'error', 'warning', 'info', and 'debug'. ('error' is the default.) 'fatal' is the most severe and 'debug' is the least.

```
Sentry.configureScope((scope) => {
  scope.setExtra("character_name", "Mighty Fighter");
});
```

&nbsp;
## Setting the Fingerprint

Sentry uses one or more "fingerprints" to decide how to group errors into issues. 

For some very advanced use cases, you can override the Sentry defaut grouping using the `fingerprint` attribute. In supported SDKs, this attribute can be passed with the event information, and should be an array of strings.

If you wish to append information, thus making the grouping slightly less aggressive, you can do that as well by adding the special string `{ { default } }` as one of the items.

For more information, checkout [aggregate errors with custom fingerprints](https://blog.sentry.io/2018/01/18/setting-up-custom-fingerprints).

&nbsp;
### Minimal Example

This minimal example will put all exceptions of the current scope into the same issue/group:

```
Sentry.configureScope((scope) => {
  scope.setFingerprint(['my-view-function']);
});
```

There are two common real-world use cases for the `fingerprint` attribute:

&nbsp;
### Example: Split up a group into more groups (groups are too big)

Your application queries an RPC interface or external API service, so the stack trace is generally the same (even if the outgoing request is very different).

The following example will split up the default group Sentry would create (represented by `{ { default } }`) further, taking some attribute on the error object into account:

[Example written in C#]

```
using (SentrySdk.Init(o =>
  {
    o.BeforeSend = @event =>
      {
        if (@event.Exception is SqlConnection ex)
        {
          @event.SetFingerprint(new [] {"database-connection-error"});
        }
        return @event;
      };
  }
))
```

&nbsp;
### Example: Merge a lot of groups into one group (groups are too small)

A generic error, such as a database connection error, has many different stack traces and never groups together.

The following example will just completely overwrite Sentry's grouping by omitting `{ { default } }` from the array:

[Example written in C#]

```
public class MyRpcException : Exception
{
  // The name of the RPC function that was called (e.g. "getAllBlogArticles")
  public string Function { get; set; }
  
  // For example a HTTP status code returned by the server.
  public HttpStatusCode Code { get; set; }
}

using (SentrySdk.Init(o =>
{
  o.BeforeSend = @event =>
  {
    if (@event.Exception is MyRpcException ex)
    {
      @event.SetFingerprint(
        new []
        {
          "{ { default } }"
          ex.Function,
          ex.Code.ToString(),
        }
      );
    }
    return @event;
  };
}
))
```

&nbsp;
## Extra Context

In addition to the structured context that Sentry understands, you can send arbitrary key/value pairs of data which will be stored alongside the event. These are not indexed and are simply used to add additional information about what might be happening:

```
Sentry.configureScope((scope) => {
  scope.setExtra("character_name", "Mighty Fighter");
});
```

{% capture __alert_content -%}
**Be aware of maximum payload size** - There are times, when you may want to send the whole application state as extra data.
This is not recommended as application state can be very large and easily exceed the 200kB maximum that Sentry has on individual event payloads.
When this happens, you'll get an `HTTP Error 413 Payload Too Large` message as the server response or (when `keepalive: true` is set as `fetch` parameter), the request will stay in the `pending` state forever (eg. in Chrome).
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

&nbsp;
## Unsetting Context

Context is held in the current scope and thus is cleared out at the end of each operation (request etc.). You can also push and pop your own scopes to apply context data to a specific codeblock or function.

For more information [have a look at the scopes and hub documentation]({%- link
_documentation/enriching-error-data/scopes.md -%}).

&nbsp;
## Advanced Usage

### Advanced Configuration

Options are set when the SDK is first initialized.

```
Sentry.init({
  dsn: 'https://bd421d97f0d64387ac5768fe16f88f78@sentry.io/1268071',
  release: "28d497fb8af6cc3efbe160e28c1c08f08bd688fc",
  environment: 'staging',
  beforeSend: customPiiScrub(event),
  maxBreadcrumbs: 50,
  debug: true,
});
```

Checkout Sentry's complete list of [options]({%- link _documentation/error-reporting/configuration/index.md -%}) and more information on [environments]({%- link _documentation/enriching-error-data/environments.md -%}).

&nbsp;
### Source Maps

Sentry supports un-minifying JavaScript via source maps. This lets you view source code context obtained from stack traces in their original untransformed form, which is particularly useful for debugging minified code (e.g. UglifyJS), or transpiled code from a higher-level language (e.g. TypeScript, ES6).

When you're using the Sentry JavaScript SDK, the source code and source maps are automatically fetched by scraping the URLs within the stack trace. However, you may have legitimate reasons for [disabling the JavaScript source fetching in Sentry](https://blog.sentry.io/2018/07/17/source-code-fetching).

For more information, see:

- [Debuggable JavaScript in Production with Source Maps](https://blog.sentry.io/2015/10/29/debuggable-javascript-with-source-maps)
- [4 Reasons Why Your Source Maps are Broken](https://blog.sentry.io/2018/10/18/4-reasons-why-your-source-maps-are-broken)
- [Source Maps]({%- link _documentation/platforms/javascript/sourcemaps/index.md -%})

&nbsp;
### Breadcrumbs

Sentry will automatically record certain events, such as changes to the URL and XHR requests to provide context to an error.

You can manually add breadcrumbs on other events or disable breadcrumbs.

```
// Example for an application that sometimes errors after the screen resizes

window.addEventListener('resize', function(event){
  Sentry.addBreadcrumb({
    category: 'ui',
    message: 'New window size:' + window.innerWidth + 'x' + window.innerHeight,
    level: 'info'
  });
})
```

For more information, see Sentry's [Breadcrumbs docs]({%- link _documentation/enriching-error-data/breadcrumbs.md -%}).

&nbsp;
### Filter Events & Custom Logic

Sentry exposes a beforeSend callback which can be used to filter out information or add additional context to the event object.

```
Sentry.init({
  beforeSend(event) {
    // Modify the event here
    if(event.user){
      // Don't send user's email address
      delete event.user.email;
    }
    return event;
  }
});
```

For more information, see Sentry's [docs on Filtering Events]({%- link _documentation/error-reporting/configuration/filtering.md -%}).

&nbsp;
### Capturing Messages

Typically, messages are not emitted. This is most useful when you've overridden fingerprinting but need to give a useful message.

```
Sentry.captureMessage('Something went wrong');
```

&nbsp;
### Capturing Raw Events

[What's the value of capturing raw events]

[How to capture raw events]

&nbsp;
### Lazy Loading Sentry

We recommend using our bundled CDN version for the browser as explained [here]({% link _documentation/error-reporting/quickstart.md %}?platform=browser#pick-a-client-integration).

But we also offer an alternative which is still in *beta*, we call it the _Loader_.

You install by just adding this script to you website instead of the SDK bundle.
This line is everything you need, this script is <1kB gzipped and includes the `Sentry.init` call with your DSN.

```html
<script src="https://js.sentry-cdn.com/___PUBLIC_KEY___.min.js" crossorigin="anonymous"></script>
```

### What does the Loader provide?

It's small wrapper around our SDK.  
The _Loader_ does a few things:

- You will always have the newest recommend stable version of our SDK.
- It captures all _global errors_ and _unhandled promise_ rejections.
- It lazy injects our SDK into your website.
- After the SDK is loaded everything will be sent to Sentry.

By default, the _Loader_ contains all information needed for our SDK to function, like the `DSN`.  In case you want to set additional [options]({% link _documentation/error-reporting/configuration/index.md %}) you have to set them like this:


```javascript
Sentry.onLoad(() => {
  Sentry.init({
    release: '1.0.0',
    environment: 'prod'
  });
});
```

`onLoad` is a function the only the _Loader_ provides, it will be called once the SDK has been injected into the website.  With the _Loader_ `init()` works a bit different, instead of just setting the options, we merge the options internally, only for convenience so you don't have to set the `DSN` again since the _Loader_ already contains it.

As explained before, the _Loader_ lazy loads and injects our SDK into your website but you can also tell the loader to fetch it immediately instead of only fetching it when you need it. Setting `data-lazy` to `no` will tell the _Loader_ to inject the SDK as soon as possible:

```html
<script
  src="https://js.sentry-cdn.com/___PUBLIC_KEY___.min.js"
  crossorigin="anonymous"
  data-lazy="no">
</script>
```

The _Loader_ also provides a function called `forceLoad()` which does the same, so you can do the following:

```html
<script>
  Sentry.forceLoad();
  Sentry.onLoad(() => {
    // Use whatever Sentry.* function you want
  });
</script>
```

### Current limitations

As we inject our SDK asynchronously we will only monitor _global errors_ and _unhandled promise_ for you until the SDK is fully loaded.
That means that it could be that we miss breadcrumbs on the way that happened during the download.  
For example a user clicking on a button or your website is doing a XHR request.  
We will not miss any errors, only breadcrumbs and only up until the SDK is fully loaded.
You can reduce this time by manually calling `forceLoad` or set `data-lazy="no"`.
So keep this in mind.









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
