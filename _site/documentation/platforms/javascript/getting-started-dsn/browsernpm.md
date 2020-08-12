You should `init` the Sentry browser SDK as soon as possible during your application load up:

```javascript
import * as Sentry from '@sentry/browser';

Sentry.init({ dsn: '___PUBLIC_DSN___' });
```
