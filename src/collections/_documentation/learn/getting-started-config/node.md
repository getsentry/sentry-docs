You need to inform the sentry node SDK about your CDN somewhere before
application startup:

```javascript
const Sentry = require('@sentry/node');
Sentry.init({dsn: '___PUBLIC_DSN___'});
```
