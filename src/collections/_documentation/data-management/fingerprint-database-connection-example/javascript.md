```javascript
class DatabaseConnectionError extends Error {}

Sentry.init({
  ...,
  beforeSend: (event, hint) => {
    const exception = hint.originalException;

    if (!(exception instanceof Error)) {
      return event;
    }

    if (exception instanceof DatabaseConnectionError) {
      event.fingerprint = ['database-connection-error'];
    }

    return event;
  }
});
```
