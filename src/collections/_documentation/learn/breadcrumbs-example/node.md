```javascript
const { addBreadcrumb } = require('@sentry/node');

addBreadcrumb({
  category: 'auth',
  message: `Authenticated user ${user.email}`,
  level: 'info',
});
```
