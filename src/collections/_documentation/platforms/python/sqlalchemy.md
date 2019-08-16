---
title: SQLAlchemy
sidebar_order: 5
---

{% version_added 0.11.0 %}


<!-- WIZARD -->

The SQLAlchemy integration captures queries from
[SQLAlchemy](https://www.sqlalchemy.org/) as breadcrumbs. The integration is
being tested with SQLAlchemy 1.2 or later.

```python
import sentry_sdk
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

sentry_sdk.init(
    dsn="___PUBLIC_DSN___", 
    integrations=[SqlalchemyIntegration()]
)
```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->
