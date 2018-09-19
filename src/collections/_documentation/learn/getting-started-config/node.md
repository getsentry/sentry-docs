You need to inform the Sentry Node SDK about your DSN:

```javascript
const Sentry = require('@sentry/node');
Sentry.init({ dsn: '___PUBLIC_DSN___' });
```
