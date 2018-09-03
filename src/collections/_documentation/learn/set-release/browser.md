```javascript
import * as Sentry from '@sentry/browser';

Sentry.init({
  release: "{{ page.release_identifier }}"
})
```
