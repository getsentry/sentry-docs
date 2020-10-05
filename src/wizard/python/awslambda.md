---
name: AWS Lambda (Python)
doc_link: https://docs.sentry.io/platforms/python/guides/aws-lambda/
support_level: production
type: framework
---

Create a deployment package on your local machine and install the required dependencies in the deployment package.
For more information, see [AWS Lambda deployment package in Python](https://docs.aws.amazon.com/lambda/latest/dg/python-package.html).

Install our Python SDK using `pip`:

```bash
pip install --upgrade sentry-sdk
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

Check out Sentry's [AWS sample apps](https://github.com/getsentry/examples/tree/master/aws-lambda/python) for detailed examples.

### Timeout Warning

The timeout warning reports an issue when the function execution time is near
the [configured timeout](https://docs.aws.amazon.com/lambda/latest/dg/configuration-console.html).

To enable the warning, update the SDK initialization to set `timeout_warning` to
`true`:

```python
sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    integrations=[AwsLambdaIntegration(timeout_warning=True)]
)
```

The timeout warning is sent only if the timeout in the Lambda Function configuration is set to a value greater than one second.

<div class="alert alert-info" role="alert"><h5 class="no_toc">Note</h5><div class="alert-body content-flush-bottom">If you are using another web framework inside of AWS Lambda, the framework might catch those exceptions before we get to see them. Make sure to enable the framework specific integration as well, if one exists. See [*Integrations*](/platforms/python/#integrations) for more information.</div>
</div>
