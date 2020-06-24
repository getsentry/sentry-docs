---
title: Redis
sidebar_order: 9
---

{% version_added 0.10.0 %}

<!-- WIZARD -->
The Redis integration hooks into the [Redis client for Python](https://pypi.org/project/redis/) and logs all Redis commands as [breadcrumbs](/enriching-error-data/breadcrumbs/).

```python
import sentry_sdk
from sentry_sdk.integrations.redis import RedisIntegration

sentry_sdk.init(
    dsn='___PUBLIC_DSN___',
    integrations=[RedisIntegration()]
)
```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->
