```javascript
import * as sentry from '@sentry/electron';

Sentry.init({
  release: "{{ page.release_identifier }}",
})
```
