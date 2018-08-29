Options are passed to the `init()` function as optional keyword arguments:

```python
import sentry_sdk

sentry_sdk.init(
    '___PUBLIC_DSN___',
    max_breadcrumbs=50,
    debug=True,
)
```
