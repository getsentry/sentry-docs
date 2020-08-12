```javascript
import * as Sentry from '@sentry/browser';

init({
  beforeSend(event, hint) {
    const error = hint.originalException;
    if (error && error.message && error.message.match(/database unavailable/i)) {
      event.fingerprint = ['database-unavailable'];
    }
    return event;
  }
});
```

For information about which hints are available see [hints in JavaScript](/platforms/javascript/#hints).
