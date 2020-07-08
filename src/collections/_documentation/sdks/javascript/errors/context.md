---
title: Event Context
excerpt: ""
---

{%- capture errors_configure_tags -%}
Most SDKs generally support configuring tags by configuring the scope:

```js
Sentry.setTag("page_locale", "de-at");
```

{%- endcapture -%}

{%- capture errors_release_name -%}

For JavaScript developers, a release is also used for applying source maps to minified JavaScript to view original, untransformed source code.

{%- endcapture -%}

{%- capture __errors_set_level -%}

To set the level out of scope, you can call `captureMessage()` per event:

```js
Sentry.captureMessage('this is a debug message', 'debug');
```

To set the level within scope, you can call `setLevel()`:

```js
Sentry.configureScope(function(scope) { 
   scope.setLevel(Sentry.Severity.Warning);
});
```

or per event:

```js
Sentry.withScope(function(scope) { 
   scope.setLevel("info"); Sentry.captureException("info");
});
```
{%- endcapture -%}

{%- capture __errors_capture_user -%}

```js
Sentry.setUser({"email": ["john.doe@example.com](mailto:%22john.doe@example.com)"});
```

{%- endcapture -%}

{%- capture __errors_grouping_example -%}

```js
Sentry.configureScope(function(scope) {
  scope.setFingerprint(['my-view-function']);
});
```
{%- endcapture -%}

{%- capture __errors_grouping_split -%}

```js
    function makeRequest(path, options) {
        return fetch(path, options).catch(function(err) {
            Sentry.withScope(function(scope) {
                scope.setFingerprint(['{{ default }}', path]);
                Sentry.captureException(err);
            });
        });
    }
```
{%- endcapture -%}

{%- capture __errors_grouping_merge -%}

```js
    Sentry.withScope(function(scope) {
      scope.setFingerprint(['Database Connection Error']);
      Sentry.captureException(err);
    });
```

{%- endcapture -%}

{%- capture __errors_configure_tags -%}

```js
Sentry.setTag("page_locale", "de-at");
```

{%- endcapture -%}

{%- capture __errors_configure_extra_context -%}

```js
Sentry.setContext("character_attributes", {
  name: "Mighty Fighter",
  age: 19,
  attack_type: "melee"
});
```

{%- endcapture -%}

{%- capture __errors_extra_context -%}

### Passing Context Directly

Starting in version 5.16.0 of our JavaScript SDKs, some of the contextual data can be provided directly to `captureException` and `captureMessage` calls. Provided data will be merged with the one that is already stored inside the current scope, unless explicitly cleared using a callback method.

This functionality works in three different variations:

1. Plain object containing updatable attributes
2. Scope instance that we will extract the attributes from
3. Callback function that will receive the current scope as an argument and allow for modifications

We allow the following context keys to be passed: `tags`, `extra`, `contexts`, `user`, `level`, `fingerprint`.

#### Example Usages

```js
Sentry.captureException(new Error("something went wrong"), {
  tags: {
    section: "articles",
  }
});
```

Explicitly clear what has been already stored on the scope:

```js
Sentry.captureException(new Error("clean as never"), (scope) => {
  scope.clear();
  scope.setTag("clean", "slate");
  return scope;
});
```

Use Scope instance to pass the data (its attributes will still merge with the global scope):

```js
const scope = new Sentry.Scope();
scope.setTag("section", "articles");
Sentry.captureException(new Error("something went wrong"), scope);
```

Use Scope instance to pass the data and ignore globally configured Scope attributes:

```js
const scope = new Sentry.Scope();
scope.setTag("section", "articles");
Sentry.captureException(new Error("something went wrong"), () => scope);
```

### Unsetting Context

Context is held in the current scope and thus is cleared out at the end of each operation — request and so forth. You can also push and pop your own scopes to apply context data to a specific code block or function.

Sentry supports two different scopes for unsetting context:

1. A global scope, which Sentry does not discard at the end of an operation
2. A scope created by the user

This will be changed for all future events:
```js
Sentry.setUser(someUser);
```

This will be changed only for the error caught inside the `withScope` callback and automatically restored to the previous value afterward:
```js
Sentry.withScope(function(scope) {
  scope.setUser(someUser);
  Sentry.captureException(error);
});
```

If you want to remove globally configured data from the scope, you can call:

```js
Sentry.configureScope(scope => scope.clear())
```

To learn more about setting the Scope, see <developer doc for Scopes and Hubs>

{%- endcapture -%}

{%- include common/errors-context.md 
errors_configure_tags=__errors_configure_tags
errors_release_name=__errors_release_name
errors_set_level=__errors_set_level
errors_capture_user=__errors_capture_user
errors_grouping_example=__errors_grouping_example
errors_grouping_split=__errors_grouping_split
errors_grouping_merge=__errors_grouping_merge
errors_configure_tags=__errors_configure_tags
errors_configure_extra_context=__errors_configure_extra_context
errors_extra_context=__errors_extra_context
-%}