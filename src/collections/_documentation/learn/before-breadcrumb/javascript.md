
```javascript
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'https://<key>@sentry.io/',
  beforeBreadcrumb(breadcrumb, hint) {
    return breadcrumb.category === 'ui.click' ? null : breadcrumb;
  },
});
```
