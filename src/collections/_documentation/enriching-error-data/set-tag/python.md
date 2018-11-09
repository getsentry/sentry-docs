```python
from sentry_sdk import configure_scope

with configure_scope() as scope:
    scope.set_tag("{{ page.example_tag_name }}", "{{ page.example_tag_value }}")
```
