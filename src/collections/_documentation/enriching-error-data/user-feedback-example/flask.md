Custom 500 handler:

```python
from flask import render_template
from sentry_sdk import last_event_id

@app.errorhandler(500)
def server_error_handler(error):
    return render_template("500.html", sentry_event_id=last_event_id()), 500
```

And the template that brings up the dialog:


```html
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.min.js" integrity="{% sdk_cdn_checksum sentry.javascript.browser latest bundle.min.js %}" crossorigin="anonymous"></script>
{% raw %}
{% if sentry_event_id %}
<script>
  Sentry.init({ dsn: '___PUBLIC_DSN___' });
  Sentry.showReportDialog({ eventId: '{{ sentry_event_id }}' })
</script>
{% endif %}
{% endraw %}
```
