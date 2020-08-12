You need to call `init` in your `main` and every `renderer` process you spawn.
For more details about Electron [click here](/platforms/javascript/electron/)  

```javascript
import * as Sentry from '@sentry/electron';

Sentry.init({dsn: '___PUBLIC_DSN___'});
```
