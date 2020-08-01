---
name: GCP Cloud Functions
doc_link: https://docs.sentry.io/platforms/python/gcp_cloud_functions/
support_level: production
type: framework
---
Install our Sentry SDK in the `requirements.txt` section:
```python
sentry_sdk
```

You can use the GCP Functions integration for the Python SDK like this:
```python
import sentry_sdk
from sentry_sdk.integrations.serverless import serverless_function

sentry_sdk.init(dsn="___PUBLIC_DSN___")

@serverless_function
def my_function(...): ...
```
