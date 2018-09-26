---
title: 'Vue.js (2.0)'
sidebar_order: 12
---

{% capture __alert_content -%}
This plugin only works with Vue 2.0 or greater.
{%- endcapture -%}
{%- include components/alert.html
  level="warning"
  title="Support"
  content=__alert_content
%}

To use Sentry with your Vue application, you will need to use both Raven.js (Sentry’s browser JavaScript SDK) and the Raven.js Vue plugin.

On its own, Raven.js will report any uncaught exceptions triggered from your application. For advanced usage examples of Raven.js, please read [_Raven.js usage_]({%- link _documentation/clients/javascript/usage.md -%}).

Additionally, the Raven.js Vue plugin will capture the name and props state of the active component where the error was thrown. This is reported via Vue’s _config.errorHandler_ hook.

<!-- WIZARD -->
## Installation

Raven.js and the Raven.js Vue plugin are distributed using a few different methods.

### Using our CDN

For convenience, our CDN serves a single, minified JavaScript file containing both Raven.js and the Raven.js Vue plugin. It should be included **after** Vue, but **before** your application code.

Example:

```html
<script src="https://cdn.jsdelivr.net/vue/2.0.0-rc/vue.min.js"></script>
<script src="https://cdn.ravenjs.com/3.26.4/vue/raven.min.js" crossorigin="anonymous"></script>
<script>Raven.config('___PUBLIC_DSN___').install();</script>
```

Note that this CDN build auto-initializes the Vue plugin.

### Using package managers

Both Raven.js and the Raven.js Vue plugin can be installed via npm and Bower.

#### npm

```sh
$ npm install raven-js --save
```

```html
<script src="/node_modules/vue/dist/vue.js"></script>
<script src="/node_modules/raven-js/dist/raven.js"></script>
<script src="/node_modules/raven-js/dist/plugins/vue.js"></script>
<script>
  Raven
    .config('___PUBLIC_DSN___')
    .addPlugin(Raven.Plugins.Vue)
    .install();
</script>
```

#### Bower

```sh
$ bower install raven-js --save
```

```html
<script src="/bower_components/vue/dist/vue.js"></script>
<script src="/bower_components/raven-js/dist/raven.js"></script>
<script src="/bower_components/raven-js/dist/plugins/vue.js"></script>
<script>
  Raven
    .config('___PUBLIC_DSN___')
    .addPlugin(Raven.Plugins.Vue)
    .install();
</script>
```

These examples assume that Vue is exported globally as _window.Vue_. You can alternatively pass a reference to the _Vue_ object directly as the second argument to _addPlugin_:

```javascript
Raven.addPlugin(Raven.Plugins.Vue, Vue);
```

### Module loaders

In your main application file, import and configure both Raven.js and the Raven.js Vue plugin as follows:

```js
import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

Raven
    .config('___PUBLIC_DSN___')
    .addPlugin(RavenVue, Vue)
    .install();
```

<!-- ENDWIZARD -->
