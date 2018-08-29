```javascript
import { addBreadcrumb } from '@sentry/electron';

addBreadcrumb({
  category: 'auth',
  message: `Authenticated user ${user.email}`,
  level: 'info',
});
```
