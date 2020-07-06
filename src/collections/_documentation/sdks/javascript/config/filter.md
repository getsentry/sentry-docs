---
title: Filtering Events Reported to Sentry
excerpt: ""
---

{%- capture __filter-stack-trace -%}

For example, with JavaScript errors, a minified source code can result in a nondeterministic stack trace that could interfere with event grouping, which can be avoided by ensuring Sentry has access to your [Source Maps](/platforms/javascript/sourcemaps) and minified artifacts. 

 ![JavaScript stack trace without source maps]({% asset guides/manage-event-stream/04.png @path %})
 ![JavaScript stack trace with source maps]({% asset guides/manage-event-stream/05.png @path %})
 
 {%- endcapture -%}

{%- capture __filter-init_content -%}
In JavaScript, you can use a function to modify the event or return a completely new one. If you return `null`, the event will be discarded.

```js
Sentry.init({
  dsn: '___PUBLIC_DSN___',
  beforeSend(event) {
    // Modify the event here
    if (event.user) {
      // Don't send user's email address
      delete event.user.email;
    }
    return event;
  }
});
```

{%- endcapture -%}

{%- capture __filter-example_content -%}
In JavaScript, you can use a function to modify the event or return a completely new one. If you return `null`, the event will be discarded.

```js
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  beforeSend(event, hint) {
    const error = hint.originalException;
    if (error && error.message && error.message.match(/database unavailable/i)) {
      event.fingerprint = ['database-unavailable'];
    }
    return event;
  }
});
```

{%- endcapture -%}

{%- capture __filter-sample-rate_content -%}

```js
Sentry.init({ sampleRate: 0.25 })
```

{%- endcapture -%}

{%- capture __filter-hint_content -%}

```js
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  beforeSend(event, hint) {
    const error = hint.originalException;
    if (error && error.message && error.message.match(/database unavailable/i)) {
      event.fingerprint = ['database-unavailable'];
    }
    return event;
  }
});
```

{%- endcapture -%}

{%- include common/filter-events.md 
sdk_name="JavaScript"

filter-stack-trace=__filter-stack-trace
filter-init_content=__filter-init_content 
filter-example_content=__filter-example_content
filter-sample-rate_content=__filter-sample-rate_content
filter-hint_content=__filter-hint_content
 -%}