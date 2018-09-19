```python
from sentry_sdk import configure_scope

with configure_scope() as scope:
    scope.set_user({"email": "{{ page.example_user_email }}"})
```
