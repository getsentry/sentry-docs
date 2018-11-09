```javascript
import * as Sentry from '@sentry/browser';

init({
  beforeSend(event, hint) {
    const { message } = hint.originalException;
    if (message && message.match(/database unavailable/i)) {
      event.fingerprint = ['database-unavailable'];
    }
    return event;
  }
});
```

For information about which hints are available see [hints in JavaScript]({% link _documentation/platforms/javascript/index.md %}#hints).
