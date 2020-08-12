<!-- WIZARD -->

Additionally, the Vue _integration_ will capture the name and props state of the active component where the error was thrown. This is reported via Vue’s `config.errorHandler` hook.

Passing in `Vue` is optional, if you do not pass it `window.Vue` has to be present.

{% capture __alert %}
Please note that if you enable this integration Vue internally will not call `logError` 
due to a currently know limitation see: [GitHub Issue](https://github.com/vuejs/vue/issues/8433).  
This means that errors occurring in the Vue renderer will not show up in the developer console.
{% endcapture %}

{% include components/alert.html
  title="Vue Error Handling"
  content=__alert
  level="warning"
%}

```javascript
import * as Sentry from '@sentry/browser'

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [new Sentry.Integrations.Vue({ Vue })]
})
```

<!-- ENDWIZARD -->
