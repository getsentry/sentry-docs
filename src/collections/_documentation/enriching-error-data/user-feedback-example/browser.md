If you're using a framework like [React]({%- link _documentation/platforms/javascript/react.md -%}) or [Angular]({%- link _documentation/platforms/javascript/angular.md -%}), the best place to collect user feedback is in your error-handling component. (Please see platform-specific docs for examples.) If you're not using a framework, you can collect feedback right before the event is sent, using `beforeSend`:

```html
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.min.js" crossorigin="anonymous"></script>

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
