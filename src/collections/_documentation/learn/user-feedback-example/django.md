Custom 500 handler:

```python
from sentry_sdk import last_event_id
from django.shortcuts import render

def handler500(request, *args, **argv):
    return render(request, "500.html", {
        'sentry_event_id': last_event_id(),
    }, status=500)
```

And the template that brings up the dialog

{% raw %}
```html
<script src="https://browser.sentry-cdn.com/{% sdk_version sentry.javascript.browser %}/bundle.min.js" crossorigin="anonymous"></script>

{% if sentry_event_id %}
<script>
  Sentry.init({ dsn: '___PUBLIC_DSN___' });
  Sentry.showReportDialog({ eventId: '{{ sentry_event_id }}' })
</script>
{% endif %}
```
{% endraw %}
