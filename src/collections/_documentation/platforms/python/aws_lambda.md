---
title: AWS Lambda
sidebar_order: 7
---

{% version_added 0.3.5 %}

<!-- WIZARD -->
Create a deployment package on your local machine and install the required dependencies in the deployment package. 
For more information, see [Building an AWS Lambda deployment package for Python](https://aws.amazon.com/premiumsupport/knowledge-center/build-python-lambda-deployment-package/).

Install our Python SDK using `pip`:

```bash
$ pip install --upgrade sentry-sdk
```

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

Create the deployment package in .zip format and upload it to AWS Lambda as a Lambda function. Checkout Sentry's [aws sample apps](https://github.com/getsentry/examples/tree/master/aws-lambda/python) for detailed examples. 

{% capture __alert_content -%}
If you are using another web framework inside of AWS Lambda, the framework might catch those exceptions before we get to see them. Make sure to enable the framework specific integration as well, if one exists. See [*Integrations*](/platforms/python/#integrations) for more information.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->

## Behavior

With the AWS Lambda integration enabled, the Python SDK will:

* Automatically report all uncaught exceptions from your lambda functions including a link to the cloudwatch logs, the function details and sys.argv for the function. You can add more context as described [here](/platforms/python#setting-context) 

* {% include platforms/python/request-data.md %}
