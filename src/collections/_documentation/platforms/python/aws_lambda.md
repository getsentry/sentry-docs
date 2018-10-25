---
title: AWS Lambda
sidebar_order: 4
---

{% version_added 0.3.5 %}

<!-- WIZARD -->
*Import name: `sentry_sdk.integrations.aws_lambda.AwsLambdaIntegration`*

The AWS Lambda integration for the Python SDK can be used like this:

```python
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    integrations=[AwsLambdaIntegration()]
)

def my_function(event, context):
    ...
```
<!-- ENDWIZARD -->

## Behavior

With the AWS Lambda integration enabled, the Python SDK will:

* Automatically report all uncaught exceptions from your lambda functions.

    {% capture __alert_content -%}
    If you are using another web framework inside of AWS Lambda, the framework might catch those exceptions before we get to see them. Make sure to enable the framework specific integration as well, if one exists.
    {%- endcapture -%}
    {%- include components/alert.html
      title="Note"
      content=__alert_content
    %}

* Attach environment data to your event:

    * Personally identifiable information (such as user ids, usernames,
      cookies, authorization headers, ip addresses) is excluded unless
      ``send_default_pii`` is set to ``true``.

    * Request data is attached to all events, if available.
