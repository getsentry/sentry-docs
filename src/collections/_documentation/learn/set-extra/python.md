```python
from sentry_sdk import configure_scope

with configure_scope() as scope:
    scope.set_extra("{{ page.example_extra_key }}", "{{ page.example_extra_value }}")
```
