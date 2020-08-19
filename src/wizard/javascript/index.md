---
name: JavaScript
doc_link: https://docs.sentry.io/error-reporting/quickstart/?platform=browser
support_level: production
type: language
---

The quickest way to get started is to use the CDN hosted version of the JavaScript browser SDK:

```html
<script
  src="https://browser.sentry-cdn.com/{{ packages.version('sentry.javascript.browser') }}/bundle.min.js"
  integrity="sha384-{{ packages.checksum('sentry.javascript.browser', 'bundle.min.js', 'sha384-base64') }}"
  crossorigin="anonymous"
></script>
```

You should `init` the Sentry Browser SDK as soon as possible during your page load:

```javascript
Sentry.init({ dsn: "___PUBLIC_DSN___" });
```

One way to verify your setup is by intentionally sending an event that breaks your application.

Calling an undefined function will throw an exception:

```js
myUndefinedFunction();
```

You can verify the function caused an error by checking your browser console.
