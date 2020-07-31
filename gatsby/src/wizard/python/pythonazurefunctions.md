---
name: Azure Functions
doc_link: https://docs.sentry.io/platforms/python/azure_functions/
support_level: production
type: framework
---
Create a .venv in the local machine on VS Code, create a Python function, and install the sentry SDK:
```python
sentry_sdk
```

Add DSN value in ````__init__.py````:
```python
import sentry_sdk
from sentry_sdk.integrations.serverless import serverless_function

sentry_sdk.init(dsn="___PUBLIC_DSN___")

@serverless_function
def my_function(...): ...
```
