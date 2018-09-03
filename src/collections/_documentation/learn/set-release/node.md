```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  release: "{{ page.release_identifier }}"
})
```
