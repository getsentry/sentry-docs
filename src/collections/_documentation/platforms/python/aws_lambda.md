---
title: AWS Lambda
sidebar_order: 4
---

{% version_added 0.3.5 %}

<!-- WIZARD -->
You can use the AWS Lambda integration for the Python SDK like this:

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
<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
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
      level="info"
    %}

* {% include platforms/python/request-data.md %}

* Generally the behavior is quite similar to the [generic serverless integration]({% link _documentation/platforms/python/serverless.md %}).
