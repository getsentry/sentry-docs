---
title: Django
sidebar_order: 2
---
<!-- WIZARD -->
*Import name: `sentry_sdk.integrations.django.DjangoIntegration`*

The Django integration adds support for the [Django Web Framework](https://www.djangoproject.com/)
from Version 1.6 upwards.

1. Install `sentry-sdk`:

    ```bash
    $ pip install --upgrade 'sentry-sdk=={% sdk_version sentry.python %}'
    ```

2.  To configure the SDK, initialize it with the Django integration in your ``settings.py`` file:

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

* All exceptions leading to a Internal Server Error are reported.

* {% include platforms/python/request-data.md %}

* If you use ``django.contrib.auth`` and have set ``send_default_pii=True`` in your call to ``init``, user data (current user id, email address, username) is attached to the event.

* SQL queries will be attached as breadcrumbs.

* Logging with any logger will create breadcrumbs when the [Logging]({% link _documentation/platforms/python/logging.md %})
  integration is enabled (done by default).

## Options

The following keyword arguments can be passed to `DjangoIntegration()`:

* `transaction_style`:

  ```python
  def my_function(request):
      return "ok"

  urlpatterns = [
      url(r"^myurl/(?P<myid>\d+)/$", my_function)
  ]
  ```

  In the above code, the transaction would be set to:

  * `/myurl/{myid}` if you set `transaction_style="url"`. This matches the behavior of the old Raven SDK.
  * `my_function` if you set `transaction_style="function_name"`

  The default is `"url"`.

## User Feedback

The user feedback feature can be used with this integration.  For more information
see [User Feedback]({% link _documentation/enriching-error-data/user-feedback.md %}?platform=django).

## Reporting other status codes

In some situations it might make sense to report `404 Not Found` and other errors besides uncaught exceptions (`500 Internal Server Error`) to Sentry. This can be achieved by writing your own Django view for those status codes. For example:

```python

# urls.py

handler404 = 'mysite.views.my_custom_page_not_found_view'

# views.py

from django.http import HttpResponseNotFound
from sentry_sdk import capture_message


def my_custom_page_not_found_view(*args, **kwargs):
    capture_message("Page not found!", level="error")

    # return any response here, e.g.:
    return HttpResponseNotFound("Not found")
```

The error message you send to sentry will have the usual request data attached.

Refer to [Customizing Error
Views](https://docs.djangoproject.com/en/2.0/topics/http/views/#customizing-error-views)
from the Django documentation for more information.
