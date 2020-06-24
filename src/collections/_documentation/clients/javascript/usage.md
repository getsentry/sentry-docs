---
title: Usage
sidebar_order: 2
robots: noindex
---

By default, Raven makes a few efforts to try its best to capture meaningful stack traces, but browsers make it pretty difficult.

The easiest solution is to prevent an error from bubbling all of the way up the stack to `window`.

## Reporting Errors Correctly {#raven-js-reporting-errors}

There are different methods to report errors and this all depends a little bit on circumstances.

### try … catch

The simplest way, is to try and explicitly capture and report potentially problematic code with a `try...catch` block and `Raven.captureException`.

```javascript
try {
    doSomething(a[0])
} catch(e) {
    Raven.captureException(e)
}
```

**Do not** throw strings! Always throw an actual `Error` object. For example:

```javascript
throw new Error('broken')  // good
throw 'broken'  // bad
```

It’s impossible to retrieve a stack trace from a string. If this happens, Raven transmits the error as a plain message.

### context/wrap {#context-wrap}

`Raven.context` allows you to wrap any function to be immediately executed. Behind the scenes, Raven is just wrapping your code in a `try...catch` block to record the exception before re-throwing it.

```javascript
Raven.context(function() {
    doSomething(a[0])
})
```

`Raven.wrap` wraps a function in a similar way to `Raven.context`, but instead of executing the function, it returns another function. This is especially useful when passing around a callback.

```javascript
var doIt = function() {
    // doing cool stuff
}

setTimeout(Raven.wrap(doIt), 1000)
```

## Tracking Users

While a user is logged in, you can tell Sentry to associate errors with user data.

```javascript
Raven.setUserContext({
    email: 'matt@example.com',
    id: '123'
})
```

If at any point, the user becomes unauthenticated, you can call `Raven.setUserContext()` with no arguments to remove their data. _This would only really be useful in a large web app where the user logs in/out without a page reload._

This data is generally submitted with each error or message and allows you to figure out which users are affected by problems.

## Capturing Messages

```javascript
Raven.captureMessage('Broken!')
```

## Passing Additional Data {#raven-js-additional-context}

The `captureMessage`, `captureException`, `context`, and `wrap` functions all allow passing additional data to be tagged onto the error.

`level`

: The log level associated with this event. Default: `error`

  ```javascript
  Raven.captureMessage('Something happened', {
    level: 'info' // one of 'info', 'warning', or 'error'
  });
  ```

`logger`

: The name of the logger used to record this event. Default: `javascript`

  ```javascript
  Raven.captureException(new Error('Oops!'), {
    logger: 'my.module'
  });
  ```

  Note that logger can also be set globally via `Raven.config`.

`tags`

: [Tags](/enriching-error-data/additional-data/#tags) to assign to the event.

  ```javascript
  Raven.wrap({
    tags: {git_commit: 'c0deb10c4'}
  }, function () { /* ... */ });

  // NOTE: Raven.wrap and Raven.context accept options as first argument
  ```

  You can also set tags globally to be merged in with future exceptions events via `Raven.config`, or `Raven.setTagsContext`:

  ```javascript
  Raven.setTagsContext({ key: "value" });
  ```

  Tags given in `setTagsContext` are merged with the existing tags. If you need to remove a tag, use `getContext` to get the current context value, call `setTagsContext` with no parameters to remove all tags context data, and then call `setTagsContext` again with the tags that you want to keep.

  ```javascript
  const context = Raven.getContext(); // Note: Do not mutate context directly.
  const tags = {...context.tags};
  delete tags['TagNameToDelete'];
  Raven.setTagsContext();             // Clear all current tags from the context.
  Raven.setTagsContext(tags);         // Add back the tags you want to keep.
  ```

**Be aware of maximum payload size** - There are times, when you may want to send the whole application state as extra data.
This can be quite a large object, which can easily weigh more than 200kB. This 200kB is currently the maximum payload size of a single event you can send to Sentry.
When this happens, you'll get an `HTTP Error 413 Payload Too Large` message as the server response or (when `keepalive: true` is set as `fetch` parameter), the request will stay in the `pending` state forever (eg. in Chrome).

`extra`

: Arbitrary data to associate with the event.

  ```javascript
  Raven.context({
    extra: {planet: {name: 'Earth'}}
  }, function () { /* ... */ });

  // NOTE: Raven.wrap and Raven.context accept options as first argument
  ```

  You can also set extra data globally to be merged in with future events with `setExtraContext`:

  ```javascript
  Raven.setExtraContext({ foo: "bar" })
  ```

  Data given in `setExtraContext` is merged with the existing extra data. If you need to remove a field from the extra context data, use `getContext` to get the current context value, call `setExtraContext` with no parameters to remove all extra context data, and then call `setExtraContext` again with the extra data content that you want to keep.

  ```javascript
  const context = Raven.getContext(); // Note: Do not mutate context directly.
  const extra = {...context.extra};
  delete extra['FieldKeyToDelete'];
  Raven.setExtraContext();            // Clear all extra data from the context.
  Raven.setExtraContext(extra);       // Add back the extra data that you want to keep.
  ```

## Recording Breadcrumbs {#raven-js-recording-breadcrumbs}

Breadcrumbs are browser and application lifecycle events that are helpful in understanding the state of the application leading up to a crash.

By default, Raven.js instruments browser built-ins and DOM events to automatically collect a few useful breadcrumbs for you:

> -   XMLHttpRequests
> -   URL / address bar changes
> -   UI clicks and keypress DOM events
> -   console log statements
> -   previous errors

You can also record your own breadcrumbs:

```javascript
Raven.captureBreadcrumb({
  message: 'Item added to shopping cart',
  category: 'action',
  data: {
     isbn: '978-1617290541',
     cartSize: '3'
  }
});
```

To learn more about what types of data can be collected via breadcrumbs, see the [breadcrumbs client API specification](/enriching-error-data/breadcrumbs/).

Note that you can also disable automatic breadcrumb collection entirely or disable specific collectors:

```javascript
Raven.config('___PUBLIC_DSN___', {
  autoBreadcrumbs: {
    xhr: false
  }
});
```

For more on configuring breadcrumbs, see [_Configuration_](/clients/javascript/config/).

## Getting Back an Event ID

An event id is a globally unique id for the event that was just sent. This event id can be used to find the exact event from within Sentry.

This is often used to display for the user and report an error to customer service.

```javascript
Raven.lastEventId()
```

`Raven.lastEventId()` will be undefined until an event is sent. After an event is sent, it will contain the string id.

```javascript
Raven.captureMessage('Broken!')
alert(Raven.lastEventId())
```

## User Feedback {#javascript-user-feedback}

Often you might find yourself wanting to collect additional feedback from the user. Sentry supports this via an embeddable widget.

```javascript
try {
    handleRouteChange(...)
} catch (err) {
    Raven.captureException(err);
    Raven.showReportDialog();
}
```

For more details on this feature, see the [_User Feedback guide_](/enriching-error-data/user-feedback/).

## Verify Raven Setup

If you need to conditionally check if raven needs to be initialized or not, you can use the _isSetup_ function. It will return _true_ if Raven is already initialized:

```javascript
Raven.isSetup()
```

## Dealing with Minified Source Code {#raven-js-source-maps}

Raven and Sentry support [Source Maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

For more information, please read the [Source Map docs](https://docs.sentry.io/hosted/clients/javascript/sourcemaps/). Also, checkout our [Gruntfile](https://github.com/getsentry/raven-js/blob/master/packages/raven-js/Gruntfile.js) for a good example of what we’re doing.

You can use [Source Map Validator](https://sourcemaps.io/) to help verify that things are correct.

## CORS

If you’re hosting your scripts on another domain and things don’t get caught by Raven, it’s likely that the error will bubble up to `window.onerror`. If this happens, the error will report some ugly `Script error` and Raven will drop it on the floor since this is a useless error for everybody.

To help mitigate this, we can tell the browser that these scripts are safe and we’re allowing them to expose their errors to us.

In your `&lt;script&gt;` tag, specify the `crossorigin` attribute:

```html
<script src="//cdn.example.com/script.js" crossorigin="anonymous"></script>
```

And set an `Access-Control-Allow-Origin` HTTP header on that file.

```console
Access-Control-Allow-Origin: *
```

{% capture __alert_content -%}
Both of these steps need to be done or your scripts might not even get executed
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

## Promises {#raven-js-promises}

By default, Raven.js capture unhandled promise rejections as described in official ECMAScript 6 standard.

Most Promise libraries however, have a global hook for capturing unhandled errors. You may want to disable default behaviour by setting `captureUnhandledRejections` option to `false` and manually hook into such event handler and call `Raven.captureException` or `Raven.captureMessage` directly.

For example, the [RSVP.js library](https://github.com/tildeio/rsvp.js/) (used by Ember.js) allows you to bind an event handler to a [global error event](https://github.com/tildeio/rsvp.js#error-handling):

```javascript
RSVP.on('error', function(reason) {
    Raven.captureException(reason);
});
```

[Bluebird](http://bluebirdjs.com/) and other promise libraries report unhandled rejections to a global DOM event, `unhandledrejection`. In this case, you don’t need to do anything, we’ve already got you covered by with default `captureUnhandledRejections: true` setting.

Please consult your promise library documentation on how to hook into its global unhandled rejection handler, if it exposes one.

## Custom Grouping Behavior

In some cases you may see issues where Sentry groups multiple events together when they should be separate entities. In other cases, Sentry simply doesn’t group events together because they’re so sporadic that they never look the same.

Both of these problems can be addressed by specifying the `fingerprint` attribute.

For example, if you have HTTP 404 (page not found) errors, and you’d prefer they deduplicate by taking into account the URL:

```javascript
{% raw %}Raven.captureException(ex, {fingerprint: ['{{ default }}', 'http://my-url/']});{% endraw %}
```

For more information, see [Customize Grouping with Fingerprints](/data-management/event-grouping/).

## Preventing Abuse

By default, the Sentry server accepts errors from any host. This can lead to an abuse scenario where a malicious party triggers JavaScript errors from a different website that are accepted by your Sentry Project. To prevent this, it is recommended to whitelist known hosts where your JavaScript code is operating.

This setting can be found under the **Project Settings** page in Sentry. You’ll need to add each domain that you plan to report from into the **Allowed Domains** box. When an error is collected by Raven.js and transmitted to Sentry, Sentry will verify the `Origin` and/or `Referer` headers of the HTTP request to verify that it matches one of your allowed hosts.
