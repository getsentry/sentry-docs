```javascript
import * as Sentry from '@sentry/electron';

Sentry.init({
  release: "{{ page.release_identifier }}",
})
```
