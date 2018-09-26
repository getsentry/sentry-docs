```javascript
const { init, getClient } = require('@sentry/electron');

init({
  dsn: '___PUBLIC_DSN___',
  beforeSend: event => {
    // Check if it is an exception -> Show report dialog
    // Note that this only will work in the renderer process, it's a noop on the main process
    event.exception && getClient().showReportDialog();
    return event;
  },
});
```