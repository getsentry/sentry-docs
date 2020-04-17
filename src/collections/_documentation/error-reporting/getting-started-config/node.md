You need to inform the Sentry Node SDK about your DSN:

```javascript
import * as Sentry from '@sentry/node';
// or using CommonJS
// const Sentry = require('@sentry/node');

Sentry.init({ dsn: '___PUBLIC_DSN___' });
```
