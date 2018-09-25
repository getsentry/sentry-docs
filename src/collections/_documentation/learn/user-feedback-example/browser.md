```html
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.min.js" crossorigin="anonymous"></script>

<script>
  Sentry.init({
    dsn: '___PUBLIC_DSN___',
    beforeSend: (event) => {
      event.exception && Sentry.showReportDialog({ eventId: event.event_id });
      return event;
    }
  });
</script>
```