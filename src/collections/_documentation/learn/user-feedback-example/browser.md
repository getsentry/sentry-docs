```html
<script src="https://js.sentry-cdn.com/___PUBLIC_KEY___.min.js" crossorigin="anonymous"></script>

<script>
  Sentry.init({
    beforeSend: (event) => {
      event.exception && Sentry.showReportDialog({ eventId: event.event_id });
      return event;
    }
  });
</script>
```