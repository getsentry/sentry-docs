In Python a function can be used to modify the event or return a completely new one. If you return `None`, the event will be discarded.

```python
import sentry_sdk

def strip_sensitive_data(event, hint):
    # modify event here
    return event

sentry_sdk.init(
    before_send=strip_sensitive_data
)
```
