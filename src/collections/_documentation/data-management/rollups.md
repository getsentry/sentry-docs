---
title: 'Grouping & Fingerprints'
sidebar_order: 0
---

An important part of Sentry is the way similar events are grouped together. This turns out to be a pretty complex issue, and it's not always obvious why events are being grouped the way they are.

Errors are aggregated (and deduplicated) based on the fingerprint of the event. By default Sentry will generate its own fingerprint, but you can also customize this behavior using `scope.set_fingerprint` or equivalent API in our SDKs. For example, in JavaScript this might look like this:

```javascript
function makeRequest(method, path, options) {
    return fetch(method, path, options).catch(err => {
        Sentry.withScope(scope => {
          // extend the fingerprint with the request path
          scope.setFingerprint(['{% raw %}{{ default }}{% endraw %}', path]);
          Sentry.captureException(err);
        });
    });
}
```

The default fingerprint is generated based on information available to Sentry within the event. (Such information is stored in [_interfaces_]({%- link _documentation/development/sdk-dev/event-payloads/index.md -%}) such as `exception`, `stacktrace`, and `message`.) Fingerprints prioritize higher-value and more precise data when possible.

A simple way to understand the logic is:

-   If the interfaces used in an event differ, then those events will not be grouped together.
-   If a stack trace or exception is included in an event, then grouping will only consider this information.
-   (Uncommon) If the event involves a templating engine, then grouping will consider the template.
-   As a fallback, the message of the event will be used for grouping.

In our above example you'll note we included `{% raw %}{{ default }}{% endraw %}` in the fingerprint to *extend* the built-in behavior. If you wish to entirely override Sentry's logic you can specify your own set of parameters:


```javascript
function makeRequest(method, path, options) {
    return fetch(method, path, options).catch(err => {
        Sentry.withScope(scope => {
          // group errors together based on their request and response
          scope.setFingerprint([method, path, err.statusCode]);
          Sentry.captureException(err);
        });
    });
}
```

### Grouping by Stack Trace

When Sentry detects a stack trace in the event data (either directly or as part of an exception), the grouping is effectively based entirely on the stack trace. This grouping is fairly involved but easy enough to understand.

The first and most important part is that Sentry only groups by stack trace frames reported to be from your application. Not all SDKs report this, but if that information is provided, it’s used for grouping. This means that if two stack traces differ only in parts of the stack that are not related to the application, they'll still be grouped together.

Depending on the information available, the following data can be used for each stack trace frame:

- Module name
- Normalized filename (with revision hashes, etc. removed)
- Normalized context line (essentially a cleaned up version of the sourcecode of the affected line, if provided)

This grouping usually works well, but two specific situations can throw it off if not dealt with:

- Minimized JavaScript sourcecode will destroy the grouping in really bad ways. Because of this you should ensure that Sentry can access your [Source Maps]({%- link _documentation/platforms/javascript/index.md -%}#source-maps).
- If you modify your stack trace by introducing a new level through the use of decorators, your stack trace will change and so will the grouping. To handle this, many SDKs support hiding irrelevant stack trace frames. (For example, the Python SDK will skip all stack frames with a local variable called `__traceback_hide__` set to _True_).

### Grouping By Exception

If no stack trace is available but exception info is, then the grouping will consider the `type` and `value` of the exception, as long as both pieces of data are present on the event. This grouping is a lot less reliable because of changing error messages.

### Grouping by Template

If a templating engine is involved in the event, the logic is similar to grouping by stack trace, though with less information, as template traces have less data available.

### Fallback Grouping

If everything else fails, grouping falls back to messages. In this case the grouping algorithm will try to use the message without any parameters, but if that is not available, it will use the full message attribute.

## Use Cases

### Group errors more granularly

Your application queries an RPC interface or external API service, so the stack trace is generally the same (even if the outgoing request is very different).

The following example will split up the default group Sentry would create (represented by `{% raw %}{{ default }}{% endraw %}`) further, taking some attributes on the error object into account:

{% include components/platform_content.html content_dir='fingerprint-rpc-example' %}

### Group errors more aggressively

A generic error, such as a database connection error, has many different stack traces and never groups together.

The following example will just completely overwrite Sentry's grouping by omitting `{% raw %}{{ default }}{% endraw %}` from the array:

{% include components/platform_content.html content_dir='fingerprint-database-connection-example' %}
