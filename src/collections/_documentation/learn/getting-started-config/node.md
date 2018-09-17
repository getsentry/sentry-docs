You need to inform the sentry node SDK about your DSN somewhere before
application startup:

```javascript
const Sentry = require('@sentry/node');
Sentry.init({ dsn: '___PUBLIC_DSN___' });
```
