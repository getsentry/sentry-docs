```python
import sentry_sdk

def strip_pii(event):
    # modify event here
    return event

sentry_sdk.init(
    before_send=strip_pii
)
```
