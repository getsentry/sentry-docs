---
title: Default Integrations
excerpt: ""
---

{%- capture __default-integrations -%}

### InboundFilters

*Import name: `Sentry.Integrations.InboundFilters`*

This integration allows you to ignore specific errors based on the type or message, as well as blacklist/whitelist URLs that originate from the exception. It ignores errors that start with `Script error` or `Javascript error: Script error` by default. 

Remember also that denyURL and allowURL work only for captured exceptions, not raw message events.

To configure this integration, use `ignoreErrors`, `denyUrls`, and `allowUrls` SDK options directly.

### FunctionToString

*Import name: `Sentry.Integrations.FunctionToString`*

This integration allows the SDK to provide original functions and method names, even when our error or breadcrumbs handlers wrap them.

*Import name: `Sentry.Integrations.TryCatch`*

This integration wraps native time and events APIs (`setTimeout`, `setInterval`, `requestAnimationFrame`, `addEventListener/removeEventListener`) in `try/catch` blocks to handle async exceptions.

### Breadcrumbs

*Import name: `Sentry.Integrations.Breadcrumbs`*

This integration wraps native APIs to capture breadcrumbs. By default, the Sentry SDK wraps all APIs.

Available options:

```bash
{ beacon: boolean; // Log HTTP requests done with the Beacon API 
  console: boolean; // Log calls to `console.log`, `console.debug`, etc  
  dom: boolean; // Log all click and keypress events 
  fetch: boolean; // Log HTTP requests done with the Fetch API 
  history: boolean; // Log calls to `history.pushState` and friends 
  sentry: boolean; // Log whenever we send an event to the server 
  xhr: boolean; // Log HTTP requests done with the XHR API
}
```

### GlobalHandlers

*Import name: `Sentry.Integrations.GlobalHandlers`*

This integration attaches global handlers to capture uncaught exceptions and unhandled rejections.

Available options:

```js
{ 
  onerror: boolean; 
  onunhandledrejection: boolean;
}
```

### LinkedErrors

*Import name: `Sentry.Integrations.LinkedErrors`*

This integration allows you to configure linked errors. They’ll be recursively read up to a specified limit and lookup will be performed by a specific key. By default, the Sentry SDK sets the limit to five and the key used is `cause`.

Available options:

```js
{ 
  key: string; 
  limit: number;
}
```

### UserAgent

*Import name: `Sentry.Integrations.UserAgent`*

This integration attaches user-agent information to the event, which allows us to correctly catalog and tag them with specific OS, Browser and version information.

{%- endcapture -%}

{%- capture __modify-integration -%}
To disable system integrations set `defaultIntegrations: false` when calling `init()`. 

To override their settings, provide a new instance with your config to `integrations` option. For example, to turn off browser capturing console calls: `integrations: [new Sentry.Integrations.Breadcrumbs({ console: false })]`.

{%- endcapture -%}


{%- capture __remove-integration -%}

```js
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: function(integrations) {
    // integrations will be all default integrations
    return integrations.filter(function(integration) {
      return integration.name !== 'Breadcrumbs';
    });
  }
});
```

{%- endcapture -%}

{%- include common/integration-default.md 
sdk_name="JavaScript"

default-integrations=__default-integrations
modify-integration=__modify-integration
remove-integration=__remove-integration
root_link="javascript"
 -%}