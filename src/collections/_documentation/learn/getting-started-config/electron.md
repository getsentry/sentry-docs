You need to inform the sentry electron SDK about your CDN somewhere before
application startup:

```javascript
import * as sentry from '@sentry/electron';
sentry.init({dsn: '___PUBLIC_DSN___'});
```
