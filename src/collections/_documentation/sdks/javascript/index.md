---
title: JavaScript
excerpt: ""
---

{%- capture __install_content -%}
Add the Sentry SDK as a dependency using `yarn` or `npm`:

```bash
# Using yarn
$ yarn add @sentry/browser

# Using npm
$ npm install @sentry/browser
```
{%- endcapture -%}

{%- capture __config_content -%}

```javascript
Sentry.init({ dsn: '___PUBLIC_DSN___' });
```

{%- endcapture -%}

{%- capture __verify_content -%}
For example, in JavaScript, calling an undefined function throws an exception:

```js
myUndefinedFunction();
```

{%- endcapture -%}

{%- capture __capture-error_content -%}
By including and configuring Sentry, the SDK automatically attaches global handlers to capture uncaught exceptions and unhandled rejections. Disable default behavior by changing the `onunhandledrejection` option to `false` in your GlobalHandlers integration and manually hook into each event handler and call `Sentry.captureException`  or `Sentry.captureMessage` directly.

By default, Sentry's JavaScript SDK captures unhandled promise rejections, as described in the official ECMAScript 6 standard. Configuration may be required if you are using a third-party library to implement promises.

**Note:** Browsers may take security measures when serving script files from different origins that can block error reporting.

{%- endcapture -%}

{%- capture __enrich-error_content -%}
and environment

{%- endcapture -%}

{%- capture __set-release-version_content -%}
Use the `process.env.npm_package_version`:

```js
Sentry.init({ 
dsn: '___PUBLIC_DSN___',
release: 'my-project-name@' + process.env.npm_package_version,
});
```
{%- endcapture -%}

{%- capture __sdk-specific-setup_content -%}
### Upload Source Maps

Sentry supports un-minifying JavaScript via source maps. This lets you view source code context obtained from stack traces in their original untransformed form, which is particularly useful for debugging minified code (for example, UglifyJS), or transpiled code from a higher-level language (for example, TypeScript, ES6).

We **highly recommend** you incorporate source maps with the Sentry JavaScript SDK to receive the full benefit of error tracking and monitoring. Source maps provide stack traces, which will provide more information regarding errors.

When you’re using the Sentry JavaScript SDK, the SDK automatically fetches the source code and source maps by scraping the URLs within the stack trace. However, you may disable the JavaScript source fetching by logging in to Sentry and toggling off `Allow JavaScript source fetching` in your organization's settings for Security & Privacy.

Upload source maps using our Webpack plugin or TypeScript.
{% comment %}Next phase: link to the the Webpack plugin and TypeScript content{% endcomment %}

{%- endcapture -%}

{%- capture __performance-install_content -%}

```bash
npm install --save @sentry/tracing
```

Next, initialize the integration in your call to `Sentry.init`:

```js
import * as Sentry from '@sentry/browser';
import { Integrations as ApmIntegrations } from '@sentry/tracing';
Sentry.init({
  dsn: '___PUBLIC_DSN___',
  release: 'my-project-name@' + process.env.npm_package_version,
  integrations: [
    new ApmIntegrations.Tracing(),
  ],
  tracesSampleRate: 0.25, // must be present and non-zero
});
```

{%- endcapture -%}



{%- include common/getting-started.md 
sdk_name=page.title

performance-install_content=__performance-install_content
sdk-specific-setup_content=__sdk-specific-setup_content
set-release-version_content=__set-release-version_content
enrich-error_content=__enrich-error_content
capture-error_content=__capture-error_content
verify_content=__verify_content
config_content=__config_content 
install_content=__install_content 
 -%}
 
 Next steps:
 
 - [Manage Configuration Options](/sdks/javascript/config/intro)
