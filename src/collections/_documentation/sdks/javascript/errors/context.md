---
title: Event Context
excerpt: ""
---
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
   scope.setLevel("info"); Sentry.captureException(error);
});
```
{%- endcapture -%}

{%- capture __errors_capture_user -%}

```js
Sentry.setUser({"email": ["john.doe@example.com](mailto:%22john.doe@example.com)"});
```

{%- endcapture -%}

{%- capture __errors_grouping_example

```js
Sentry.configureScope(function(scope) {
  scope.setFingerprint(['my-view-function']);
});
```
{%- endcapture -%}

{%- capture __errors_grouping_split

```js
    function makeRequest(path, options) {
        return fetch(path, options).catch(function(err) {
          Sentry.withScope(function(scope) {
             scope.setFingerprint(['', path]);
             Sentry.captureException(err);
            });
        });
    }
```
{%- endcapture -%}

{%- capture __errors_grouping_merge

```js
    Sentry.withScope(function(scope) {
      scope.setFingerprint(['Database Connection Error']);
      Sentry.captureException(err);
    });
    ```
{%- endcapture -%}

{%- capture __errors_configure_tags

```js
Sentry.setTag("page_locale", "de-at");
```

{%- endcapture -%}

{%- capture __errors_configure_custom_data

```js
Sentry.setExtra("character_name", "Mighty Fighter");
```
{%- endcapture -%}

{%- include common/errors-context.md 
errors_set_level=__errors_set_level
errors_capture_user=__errors_capture_user
errors_grouping_example=__errors_grouping_example
errors_grouping_split=__errors_grouping_split
errors_grouping_merge=__errors_grouping_merge
errors_configure_tags=__errors_configure_tags
errors_configure_custom_data=__errors_configure_custom_data
-%}