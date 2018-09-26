```html
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.min.js" crossorigin="anonymous"></script>

<script>
  Sentry.init({
    dsn: '___PUBLIC_DSN___',
    beforeSend: (event) => {
      // Check if it is an exception -> Show report dialog
      event.exception && Sentry.showReportDialog();
      return event;
    }
  });
</script>
```