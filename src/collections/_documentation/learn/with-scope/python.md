```python
from sentry_sdk import push_scope, capture_exception

with push_scope() as scope:
    scope.set_tag("my-tag", "my value")
    scope.level = 'warning'
    capture_exception(Exception("my error"))
```
