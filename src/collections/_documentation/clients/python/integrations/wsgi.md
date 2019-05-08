---
title: 'WSGI Middleware'
sidebar_order: 14
---

Raven includes a simple to use WSGI middleware.

```python
from raven import Client
from raven.middleware import Sentry

application = Sentry(
    application,
    Client('___DSN___')
)
```

{% capture __alert_content -%}
Many frameworks will not propagate exceptions to the underlying WSGI middleware by default.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}
