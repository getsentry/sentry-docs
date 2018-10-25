The Python SDK automatically drains on shutdown unless the `AtExitIntegration` is removed or the `shutdown_timeout`
config key is set to 0.  To manually drain the client provides a `close` method:

```python
from sentry_sdk import Hub

client = Hub.current.client
if client is not None:
    client.close(timeout=2.0)
```
