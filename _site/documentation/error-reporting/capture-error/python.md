In Python you can either capture a caught exception or the one currently held in
`sys.exc_info()` by not passing an argument:

```python
from sentry_sdk import capture_exception

try:
    a_potentially_failing_function()
except Exception as e:
    # Alternatively the argument can be omitted
    capture_exception(e)
```
