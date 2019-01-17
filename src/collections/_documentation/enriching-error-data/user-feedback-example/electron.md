```javascript
const { init, showReportDialog } = require('@sentry/electron');

init({
  dsn: '___PUBLIC_DSN___',
  beforeSend(event) {
    // Check if it is an exception, if so, show the report dialog
    // Note that this only will work in the renderer process, it's a noop on the main process
    if (event.exception) {
      showReportDialog();
    }
    return event;
  }
});
```
