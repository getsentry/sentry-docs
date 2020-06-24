If you're using a framework like [React](/platforms/javascript/react/) or [Angular](/platforms/javascript/angular/), the best place to collect user feedback is in your error-handling component. (Please see platform-specific docs for examples.) If you're not using a framework, you can collect feedback right before the event is sent, using `beforeSend`:

```html
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.min.js" integrity="{% sdk_cdn_checksum sentry.javascript.browser latest bundle.min.js %}" crossorigin="anonymous"></script>

<script>
  Sentry.init({
    dsn: '___PUBLIC_DSN___',
    beforeSend(event, hint) {
      // Check if it is an exception, and if so, show the report dialog
      if (event.exception) {
        Sentry.showReportDialog({ eventId: event.event_id });
      }
      return event;
    }
  });
</script>
```
