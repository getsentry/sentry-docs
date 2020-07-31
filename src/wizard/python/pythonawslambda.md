---
name: AWS Lambda
doc_link: https://docs.sentry.io/platforms/python/aws_lambda/
support_level: production
type: framework
---
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


<div class="alert alert-info" role="alert"><h5 class="no_toc">Note</h5><div class="alert-body content-flush-bottom">If you are using another web framework inside of AWS Lambda, the framework might catch those exceptions before we get to see them. Make sure to enable the framework specific integration as well, if one exists. See [*Integrations*](/platforms/python/#integrations) for more information.</div>
</div>


<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
