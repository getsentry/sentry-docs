Custom 500 handler:

```python
from flask import render_template
from sentry_sdk import last_event_id

@app.errorhandler(500)
def server_error_handler(error):
    return render_template("500.html", sentry_event_id=last_event_id()), 500
```

And the template that brings up the dialog:

{% raw %}
```html
<script src="https://js.sentry-cdn.com/___PUBLIC_KEY___.min.js"  
data-lazy="no"
crossorigin="anonymous"></script>

{% if sentry_event_id %}
<script>
  Sentry.showReportDialog({
    eventId: '{{ sentry_event_id }}',
  });
</script>
{% endif %}
```
{% endraw %}
