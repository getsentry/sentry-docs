---
title: 'SDK Fingerprinting'
sidebar_order: 0
---

In supported SDKs, you can override the Sentry default grouping passing the `fingerprint` attribute an array of strings. For example, in JavaScript you can group by the `{% raw %}method{% endraw %}`, `{% raw %}path{% endraw %}` and the `{% raw %}err.statusCode{% endraw %}` like this:

```javascript
function makeRequest(method, path, options) {
    return fetch(method, path, options).catch(function(err) {
        Sentry.withScope(function(scope) {
          // group errors together based on their request and response
          scope.setFingerprint([method, path, err.statusCode]);
          Sentry.captureException(err);
        });
    });
}
```

Similarly, you can pass `{% raw %}{{ default }}{% endraw %}` in the fingerprint to *extend* the built-in behavior:

```javascript
function makeRequest(method, path, options) {
    return fetch(method, path, options).catch(function(err) {
        Sentry.withScope(function(scope) {
          // extend the fingerprint with the request path
          scope.setFingerprint(['{% raw %}{{ default }}{% endraw %}', path]);
          Sentry.captureException(err);
        });
    });
}
```

The following extra values are available for fingerprints:

- `{% raw %}{{ default }}{% endraw %}`: adds the default fingerprint values
- `{% raw %}{{ transaction }}{% endraw %}`: groups by the event's transaction
- `{% raw %}{{ function }}{% endraw %}`: groups by the event's function name
- `{% raw %}{{ type }}{% endraw %}`: groups by the event's exception type name
- `{% raw %}{{ module }}{% endraw %}`: groups by the event's module name
- `{% raw %}{{ package }}{% endraw %}`: groups by the event's package name


## Use Cases

### Group errors more granularly

Your application queries an RPC interface or external API service, so the stack trace is generally the same (even if the outgoing request is very different).

The following example will split up the default group Sentry would create (represented by `{% raw %}{{ default }}{% endraw %}`) further, taking some attributes on the error object into account:

{% include components/platform_content.html content_dir='fingerprint-rpc-example' %}

### Group errors more aggressively

A generic error, such as a database connection error, has many different stack traces and never groups together.

The following example will just completely overwrite Sentry's grouping by omitting `{% raw %}{{ default }}{% endraw %}` from the array:

{% include components/platform_content.html content_dir='fingerprint-database-connection-example' %}