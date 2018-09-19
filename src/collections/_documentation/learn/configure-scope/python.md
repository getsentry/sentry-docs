```python
from sentry_sdk import configure_scope

with configure_scope() as scope:
    scope.set_tag("my-tag", "my value")
    scope.user = {'id': 42, 'email': 'john.doe@example.com'}
```
