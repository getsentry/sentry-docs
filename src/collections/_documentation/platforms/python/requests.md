---
title: Requests
sidebar_order: 4
---

Import name: `sentry_sdk.integrations.requests.RequestsIntegration`

When this integration is enabled HTTP requests emitted through the `requests` library
will be reported as breadcrumbs.  This integration is not enabled by default and
needs to be enabled.

```python
import sentry_sdk
from sentry_sdk.integrations.requests import RequestsIntegration

sentry_sdk.init(integrations=[RequestsIntegration()])
```
