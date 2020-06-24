```javascript
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  beforeBreadcrumb(breadcrumb, hint) {
    if (breadcrumb.category === 'ui.click') {
      const { target } = hint.event;
      if (target.ariaLabel) {
        breadcrumb.message = target.ariaLabel;
      }
    }
    return breadcrumb;
  },
});
```

For information about which hints are available see [hints in JavaScript](/platforms/javascript/#hints).
