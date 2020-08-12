```python
import sentry_sdk

def before_breadcrumb(crumb, hint):
    if crumb['category'] == 'a.spammy.Logger':
        return None
    return crumb

sentry_sdk.init(before_breadcrumb=before_breadcrumb)
```
