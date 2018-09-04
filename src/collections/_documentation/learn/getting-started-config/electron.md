You need to inform the sentry electron SDK about your CDN somewhere before
application startup:

```javascript
import * as Sentry from '@sentry/electron';
Sentry.init({dsn: '___PUBLIC_DSN___'});
```
