This function php returns the last `eventId`:

```php
\Sentry\State\Hub::getCurrent()->getLastEventId();
```

Depending on you render your templates, the example would be in a simple php file:


```html
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.min.js" crossorigin="anonymous"></script>
{% raw %}
<?php if (\Sentry\State\Hub::getCurrent()->getLastEventId()) { ?>
<script>
  Sentry.init({ dsn: '___PUBLIC_DSN___' });
  Sentry.showReportDialog({ eventId: '<?php echo \Sentry\State\Hub::getCurrent()->getLastEventId(); ?>' })
</script>
<?php } ?>
{% endraw %}
```
