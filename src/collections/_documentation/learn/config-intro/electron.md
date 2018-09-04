Options are passed to the `init()` as object:

```javascript
import * as Sentry from '@sentry/electron';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  maxBreadcrumbs: 50,
  debug: true,
})
```
