
```javascript
import * as Sentry from '@sentry/node';
// or using CommonJS
// const Sentry = require('@sentry/node');

// All integrations that come with an SDK can be found on the Sentry.Integrations object
// Custom integrations must conform Integration interface: https://github.com/getsentry/sentry-javascript/blob/master/packages/types/src/index.ts

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [new MyAwesomeIntegration()]
});
```