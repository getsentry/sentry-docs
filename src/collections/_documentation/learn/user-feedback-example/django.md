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
<script src="https://js.sentry-cdn.com/___PUBLIC_KEY___.min.js" crossorigin="anonymous"></script>

{% if sentry_event_id %}
<script>
  Sentry.showReportDialog({
    eventId: '{{ sentry_event_id }}',
  });
</script>
{% endif %}
```
{% endraw %}
