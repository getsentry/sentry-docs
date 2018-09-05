---
title: Django
sidebar_order: 2
---

In your ``settings.py``:

```python
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(dsn="https://foo@sentry.io/123", integrations=[DjangoIntegration()])
```

* All exceptions are reported.

* A bit of data is attached to each event:

    * Personally identifiable information (such as user ids, usernames,
      cookies, authorization headers, ip addresses) is excluded unless
      ``send_default_pii`` is set to ``True``.

    * Request data is attached to all events.

    * If you have ``django.contrib.auth`` installed and configured, user data
      (current user id, email address, username) is attached to the event.

* Logging with any logger will create breadcrumbs. See logging docs for more
  information.
