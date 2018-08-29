Options are passed to the `init()` as object:

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  maxBreadcrumbs: 50,
  debug: true,
})
```
