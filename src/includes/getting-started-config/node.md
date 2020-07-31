You need to inform the Sentry Node SDK about your DSN:

```javascript
const Sentry = require('@sentry/node');
// or use es6 import statements
// import * as Sentry from '@sentry/node';

Sentry.init({ dsn: '___PUBLIC_DSN___' });
```
