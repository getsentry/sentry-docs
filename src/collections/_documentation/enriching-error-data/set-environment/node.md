```javascript
import * as Sentry from '@sentry/node';
// or using CommonJS
// const Sentry = require('@sentry/node');

Sentry.init({
  environment: '{{ page.example_environment }}',
})
```
