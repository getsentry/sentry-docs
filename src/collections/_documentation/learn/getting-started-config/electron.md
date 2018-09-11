You need to call `init` in your `main` and every `renderer` process you spawn.
For more details about Electron [click here]({%- link _documentation/platforms/javascript/electron.md -%})  

```javascript
import * as Sentry from '@sentry/electron';

Sentry.init({dsn: '___PUBLIC_DSN___'});
```
