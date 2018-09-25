---
title: Django
sidebar_order: 2
---
<!-- WIZARD -->
*Import name: `sentry_sdk.integrations.django.DjangoIntegration`*

The Django integration adds support for the [Django Web Framework](https://www.djangoproject.com/)
from Version 1.6 upwards.  To configure the SDK initialize it with the Django
integration in your ``settings.py`` file:

```python
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    integrations=[DjangoIntegration()]
)
```
<!-- ENDWIZARD -->
## Behavior

This causes the following this to happen:

* All exceptions are reported.

* A bit of data is attached to each event:

    * Personally identifiable information (such as user ids, usernames,
      cookies, authorization headers, ip addresses) is excluded unless
      ``send_default_pii`` is set to ``True``.

    * Request data is attached to all events.

    * If you have ``django.contrib.auth`` installed and configured, user data
      (current user id, email address, username) is attached to the event.

* Logging with any logger will create breadcrumbs when the [Logging]({% link _documentation/platforms/python/logging.md %})
  integration is enabled (done by default).

## User Feedback

The user feedback feature can be used with this integration.  For more information
see [User Feedback]({% link _documentation/learn/user-feedback.md %}?platform=django).
