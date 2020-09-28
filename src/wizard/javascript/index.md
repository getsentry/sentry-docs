---
name: JavaScript
doc_link: https://docs.sentry.io/platforms/javascript/
support_level: production
type: language
---

The quickest way to get started is to use the CDN hosted version of the JavaScript browser SDK:

```html
<script
  src="https://browser.sentry-cdn.com/{{ packages.version('sentry.javascript.browser') }}/bundle.tracing.min.js"
  integrity="sha384-{{ packages.checksum('sentry.javascript.browser', 'bundle.tracing.min.js', 'sha384-base64') }}"
  crossorigin="anonymous"
></script>
```

You should `init` the Sentry Browser SDK as soon as possible during your page load:

```javascript
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [
    new Integrations.BrowserTracing(),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});
```

The above configuration captures both error and performance data. To reduce the volume of performance data captured, change `tracesSampleRate` to a value between 0 and 1.

One way to verify your setup is by intentionally causing an error that breaks your application.

Calling an undefined function will throw an exception:

```js
myUndefinedFunction();
```

You can verify the function caused an error by checking your browser console.
